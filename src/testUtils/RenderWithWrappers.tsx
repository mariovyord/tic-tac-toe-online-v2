import { render, RenderOptions, RenderResult } from "@testing-library/react"
import React from "react"
import { MemoryRouter } from "react-router-dom"
import { NotificationProvider } from "../contexts/NotificationContext"

interface IProps {
	children: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

const AllTheProviders: React.FC<IProps> = (props) => {
	return (
		<MemoryRouter>
			<NotificationProvider>
				{props.children}
			</NotificationProvider>
		</MemoryRouter>
	)
}

export const renderWithWrappers = (ui: React.ReactElement,
	options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
	render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

