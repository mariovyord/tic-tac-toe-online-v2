import { cleanup, screen } from "@testing-library/react"
import { renderWithWrappers } from "../../../../testUtils/RenderWithWrappers";
import Home from './PvPMenu';

afterEach(cleanup);

describe('PvP Menu', () => {
	test('renders the 2 main buttons', () => {
		renderWithWrappers(<Home />);

		const createBtn = screen.getByRole('button', { name: 'Create game' })
		const joinBtn = screen.getByRole('link', { name: 'Join game' })

		expect(createBtn).toBeInTheDocument();

		expect(joinBtn).toBeInTheDocument();
		expect(joinBtn).toHaveAttribute('href', '/game/PvP/list')
	})
})