import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { ButtonType, HAUTE_T16, SingleTemplateButton, TemplateButton } from './template'

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

  return (
    <>
      {gamepadIndex !== undefined ? (
        <ControllerDisplay gamepadIndex={gamepadIndex} />
      ) : (
        <div className='no-controller'>No controller detected</div>
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
        <Button button={b} pressed={buttonState[i]} key={i} />
      ))}
    </svg>
  )
}

function ControllerBase({ width, height, r }: { width: number; height: number; r: number }) {
  return <rect className='controller-base' x={0} y={0} width={width} height={height} rx={r} />
}

function Button({ button, pressed }: { button: TemplateButton; pressed: boolean }) {
  return Array.isArray(button) ? (
    button.map((b, i) => <ButtonContents button={b} pressed={pressed} key={i} />)
  ) : (
    <ButtonContents button={button} pressed={pressed} />
  )
}

function ButtonContents({ button, pressed }: { button: SingleTemplateButton; pressed: boolean }) {
  const buttonClass = clsx('controller-button', {
    directional: button.type === ButtonType.Directional,
    special: button.type === ButtonType.Special,
    menu: button.type === ButtonType.Menu,
  })
  return (
    <>
      <circle className={buttonClass} cx={button.x} cy={button.y} r={button.r} />
      {pressed ? (
        <circle className={'pressed-overlay'} cx={button.x} cy={button.y} r={button.r} />
      ) : undefined}
      <circle className={'controller-button-stroke'} cx={button.x} cy={button.y} r={button.r} />
    </>
  )
}
