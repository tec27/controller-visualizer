import { useEffect, useRef, useState } from 'react'
import './App.css'
import { HAUTE_T16 } from './templates/haute-t16'
import { TemplateButton } from './templates/template'

export default function App() {
  const [gamepadIndex, setGamepadIndex] = useState<number>()
  const gamepadIndexRef = useRef<number>()

  useEffect(() => {
    const abortListener = new AbortController()
    window.addEventListener(
      'gamepadconnected',
      e => {
        setGamepadIndex(e.gamepad.index)
        gamepadIndexRef.current = e.gamepad.index
      },
      { signal: abortListener.signal },
    )
    window.addEventListener(
      'gamepaddisconnected',
      e => {
        if (gamepadIndexRef.current === e.gamepad.index) {
          setGamepadIndex(undefined)
          gamepadIndexRef.current = undefined
        }
      },
      { signal: abortListener.signal },
    )

    return () => {
      abortListener.abort()
    }
  }, [])

  // a
  // b
  // x
  // y
  // lb
  // rb
  // lt
  // rt
  // back
  // start
  // ls
  // rs
  // up
  // down
  // left
  // right
  // home

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
        {/* <img src='t16.png' style={{ position: 'absolute', left: 0, top: 0 }} /> */}
      </div>
      {gamepadIndex !== undefined ? (
        <ControllerDisplay gamepadIndex={gamepadIndex} />
      ) : (
        'No controller detected'
      )}
    </>
  )
}

function ControllerDisplay({ gamepadIndex }: { gamepadIndex: number }) {
  const [buttonState, setButtonState] = useState<boolean[]>([])

  useEffect(() => {
    let request: number | undefined

    const onFrame = () => {
      const gamepad = navigator.getGamepads()[gamepadIndex]
      if (gamepad) {
        const newButtonState = gamepad.buttons.map(b => b.pressed)
        if (
          newButtonState.length !== buttonState.length ||
          newButtonState.some((v, i) => v !== buttonState[i])
        ) {
          setButtonState(newButtonState)
        }
      }
      request = requestAnimationFrame(onFrame)
    }

    request = requestAnimationFrame(onFrame)
    return () => {
      if (request) {
        cancelAnimationFrame(request)
      }
    }
  })

  return (
    <svg
      width='100%'
      height='100%'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 640 360'>
      <ControllerBase width={640} height={360} r={24} />
      {HAUTE_T16.map((b, i) => (
        <Button button={b} pressed={buttonState[i]} />
      ))}
    </svg>
  )
}

function ControllerBase({ width, height, r }: { width: number; height: number; r: number }) {
  return <rect className='controller-base' x={0} y={0} width={width} height={height} rx={r} />
}

function Button({ button, pressed }: { button: TemplateButton; pressed: boolean }) {
  const className = pressed ? 'controller-button pressed' : 'controller-button'
  return Array.isArray(button) ? (
    button.map(b => <circle className={className} cx={b.x} cy={b.y} r={b.r} />)
  ) : (
    <circle className={className} cx={button.x} cy={button.y} r={button.r} />
  )
}
