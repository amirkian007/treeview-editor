import React from 'react'

const data = {
  arrow: (
    <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24">
      <path fill="rgb(28, 30, 33)" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
    </svg>
  )
} as const

type icons = typeof data

export const Icon: React.FC<{ iconname: keyof icons }> = ({ iconname }) => {
  return data[iconname]
}
