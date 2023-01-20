// Import the Spinner component into this file and test
import Spinner from './Spinner'
import React from 'react'
import { render, screen, wait, fireEvent} from "@testing-library/react"
// that it renders what it should for the different props it can take.

test('sanity', () => {
  render(<Spinner/>)
})
