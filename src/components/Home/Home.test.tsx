import { cleanup, screen } from "@testing-library/react"
import { renderWithWrappers } from "../../testUtils/RenderWithWrappers";
import Home from './Home';

afterEach(cleanup);

describe('Home', () => {
	test('renders the 2 main buttons', () => {
		renderWithWrappers(<Home />);

		const PvEBtn = screen.getByRole('link', { name: 'Play vs Artificial Intelligence' })
		const PvPBtn = screen.getByRole('link', { name: 'Play vs Real Players' })

		expect(PvEBtn).toBeInTheDocument();
		expect(PvPBtn).toBeInTheDocument();
	})
})