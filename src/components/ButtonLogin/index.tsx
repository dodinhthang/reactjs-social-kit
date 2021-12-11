import React, { useState } from 'react'

interface Props {
  className?: string
  style?: React.CSSProperties
  onClick?: Function
  onMouseEnter?: Function
  onMouseLeave?: Function
  children?: React.ReactNode
  icon?: React.ReactNode
  text: String
  disabled?: boolean
}

export default function ButtonLogin({
  className,
  style,
  onMouseEnter,
  onClick,
  onMouseLeave,
  text,
  children,
  icon,
  disabled
}: Props) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleMouseEnter = () => {
    setHovered(true)
    if (typeof onMouseEnter === 'function') {
      onMouseEnter()
    }
  }

  const handleMouseLeave = () => {
    setHovered(true)
    if (typeof onMouseLeave === 'function') {
      onMouseLeave()
    }
  }

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(true)
  }

  const handleClick = (e: any) => {
    if (typeof onClick === 'function') {
      onClick(e)
    }
  }

  return (
    <button
      type='button'
      style={{ ...styles.button, ...style }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      disabled={disabled}
    >
      <div style={styles.flex}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
        <div style={styles.divider} />
        <div style={{ textAlign: 'left', width: '100%' }}>
          {children || text}
          {focused || hovered}
        </div>
      </div>
    </button>
  )
}

const styles = {
  button: {
    display: 'block',
    border: 0,
    borderRadius: 3,
    boxShadow: 'rgba(0, 0, 0, 0.5) 0 1px 2px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '19px',
    margin: '5px',
    width: 'calc(100% - 10px)',
    overflow: 'hidden'
  },
  divider: {
    width: '10px'
  },
  flex: {
    alignItems: 'center',
    display: 'flex',
    height: '100%'
  }
}
