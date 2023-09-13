import { render, fireEvent, screen, getByRole, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Login from '@/pages/site/login'

test('redirects to home page on successful login', async () => {

  render(<Login />)

  const emailInput = screen.getByLabelText('Email')
  const passwordInput = screen.getByLabelText('Password')

  fireEvent.change(emailInput, { target: { value: 'dave@gmail.com' } })
  fireEvent.change(passwordInput, { target: { value: 'password' } })

  const onSubmit = vi.fn(event => event.preventDefault())
  const form = document.querySelector('form') as HTMLElement

  form.onsubmit = onSubmit

  fireEvent.submit(screen.getByRole('button', { name: 'Continue' }))

  await waitFor
})