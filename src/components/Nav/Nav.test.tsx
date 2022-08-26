import { cleanup, screen } from "@testing-library/react"
import path from "path";
import fs from 'fs'
import { renderWithWrappers } from "../../testUtils/RenderWithWrappers";
import Home from './Nav';
import { debug } from "console";

afterEach(cleanup);

describe('Navigation bar', () => {
	test('renders 3 anchors on both desktop and mobile menu', () => {
		renderWithWrappers(<Home />);

		const homeBtn = screen.getAllByRole('link', { name: 'Home' });
		const profileBtn = screen.getAllByRole('link', { name: 'Profile' });
		const logoutBtn = screen.getAllByRole('link', { name: 'Logout' });

		expect(homeBtn).toHaveLength(2);
		expect(homeBtn[0]).toHaveAttribute('href', '/');

		expect(profileBtn).toHaveLength(2);
		expect(profileBtn[0]).toHaveAttribute('href', '/profile');

		expect(logoutBtn).toHaveLength(2);
		expect(logoutBtn[0]).toHaveAttribute('href', '/logout');
	})
})