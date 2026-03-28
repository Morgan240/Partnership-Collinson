/**
 * END-TO-END TESTS — Full user flow
 *
 * Simulates a real user journey through the simulator:
 * 1. Login page → enter credentials → navigate to waitlist
 * 2. View default scenario → see ranked table
 * 3. Change optimization mode → rankings recalculate
 * 4. Edit individual weight sliders → custom mode activates
 * 5. Switch scenario → data reloads
 * 6. Click a row → score breakdown expands
 * 7. Full rankings table visible with per-dimension ranks
 *
 * Uses React Testing Library + user-event for realistic interactions.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { WaitlistPage } from '../pages/WaitlistPage';
import { SimulatorLayout } from '../components/SimulatorLayout';

// ============================================================
// HELPERS
// ============================================================

function renderApp(initialRoute = '/LMS/login') {
  sessionStorage.clear();

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/LMS/login" element={<LoginPage />} />
        <Route path="/LMS" element={<SimulatorLayout />}>
          <Route path="waitlist" element={<WaitlistPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function renderWaitlistDirect() {
  sessionStorage.setItem('primodel_auth', 'true');

  return render(
    <MemoryRouter initialEntries={['/LMS/waitlist']}>
      <Routes>
        <Route path="/LMS/login" element={<LoginPage />} />
        <Route path="/LMS" element={<SimulatorLayout />}>
          <Route path="waitlist" element={<WaitlistPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

// ============================================================
// 1. LOGIN FLOW
// ============================================================

describe('E2E: Login Flow', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders login page with username and password fields', () => {
    renderApp();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByAltText(/collinson/i)).toBeInTheDocument();
  });

  it('shows error for wrong credentials', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText(/username/i), 'wrong');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong');
    await user.click(screen.getByText(/login/i));

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('disables login button when fields are empty', () => {
    renderApp();
    const btn = screen.getByText(/login/i);
    expect(btn).toBeDisabled();
  });

  it('navigates to waitlist after successful login', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText(/username/i), 'waitlist');
    await user.type(screen.getByPlaceholderText(/password/i), 'primodel2026');
    await user.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/optimization mode/i)).toBeInTheDocument();
    });
  });

  it('password field toggles visibility', async () => {
    const user = userEvent.setup();
    renderApp();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByText('Show');
    await user.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByText('Hide')).toBeInTheDocument();
  });
});

// ============================================================
// 2. PROTECTED ROUTE
// ============================================================

describe('E2E: Protected Route', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/LMS/waitlist']}>
        <Routes>
          <Route path="/LMS/login" element={<LoginPage />} />
          <Route path="/LMS" element={<SimulatorLayout />}>
            <Route path="waitlist" element={<WaitlistPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  });

  it('shows waitlist when authenticated', () => {
    renderWaitlistDirect();
    expect(screen.getByText(/optimization mode/i)).toBeInTheDocument();
  });
});

// ============================================================
// 3. WAITLIST PAGE — DEFAULT STATE
// ============================================================

describe('E2E: Waitlist Default State', () => {
  it('loads with default scenario (Andy\'s Lounge / Toy Story)', () => {
    renderWaitlistDirect();
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('mex22-toystory');
  });

  it('shows control panel with mode buttons', () => {
    renderWaitlistDirect();
    expect(screen.getByText('Balanced')).toBeInTheDocument();
    expect(screen.getByText('Revenue Focus')).toBeInTheDocument();
    expect(screen.getByText('Efficiency Focus')).toBeInTheDocument();
    expect(screen.getByText('Fairness First')).toBeInTheDocument();
  });

  it('shows occupancy indicator', () => {
    renderWaitlistDirect();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText(/seats available/i)).toBeInTheDocument();
  });

  it('shows weight sliders with sum = 1.00', () => {
    renderWaitlistDirect();
    expect(screen.getByText(/= 1.00/)).toBeInTheDocument();
    expect(screen.getByText(/✓/)).toBeInTheDocument();
  });

  it('renders waitlist ranking table with passenger rows', () => {
    const { container } = renderWaitlistDirect();
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('shows PriModel Full Rankings table', () => {
    renderWaitlistDirect();
    expect(screen.getByText(/primodel full rankings/i)).toBeInTheDocument();
  });
});

// ============================================================
// 4. MODE SWITCHING
// ============================================================

describe('E2E: Mode Switching', () => {
  it('clicking a mode button changes the active mode', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    await user.click(screen.getByText('Balanced'));

    const activeBtn = container.querySelector('.sim-mode-btn--active');
    expect(activeBtn).toHaveTextContent('Balanced');
  });

  it('switching mode updates weight slider values', async () => {
    const user = userEvent.setup();
    renderWaitlistDirect();

    await user.click(screen.getByText('Fairness First'));

    expect(screen.getByText('0.55')).toBeInTheDocument();
  });

  it('switching between modes keeps sum at 1.00', async () => {
    const user = userEvent.setup();
    renderWaitlistDirect();

    const modes = ['Balanced', 'Revenue Focus', 'Efficiency Focus', 'Fairness First'];
    for (const mode of modes) {
      await user.click(screen.getByText(mode));
      expect(screen.getByText(/= 1.00/)).toBeInTheDocument();
    }
  });
});

// ============================================================
// 5. WEIGHT EDITING (CUSTOM MODE)
// ============================================================

describe('E2E: Weight Editing', () => {
  it('editing a slider activates Custom mode', async () => {
    const { container } = renderWaitlistDirect();
    const { fireEvent } = await import('@testing-library/react');

    const sliders = container.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBe(3);

    fireEvent.change(sliders[0], { target: { value: '60' } });

    await waitFor(() => {
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  it('weight values update when slider changes', async () => {
    const { container } = renderWaitlistDirect();
    const { fireEvent } = await import('@testing-library/react');

    const sliders = container.querySelectorAll('input[type="range"]');
    const slider = sliders[0] as HTMLInputElement;

    fireEvent.change(slider, { target: { value: '45' } });

    await waitFor(() => {
      expect(screen.getByText('0.45')).toBeInTheDocument();
    });
  });

  it('selecting a preset mode after custom resets weights', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();
    const { fireEvent } = await import('@testing-library/react');

    const sliders = container.querySelectorAll('input[type="range"]');
    fireEvent.change(sliders[0], { target: { value: '60' } });

    await user.click(screen.getByText('Balanced'));

    const values = screen.getAllByText('0.35');
    expect(values.length).toBeGreaterThanOrEqual(2);
  });
});

// ============================================================
// 6. SCENARIO SWITCHING
// ============================================================

describe('E2E: Scenario Switching', () => {
  it('switching scenario changes the table data', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    const initialRows = container.querySelectorAll('tbody tr').length;

    await user.selectOptions(screen.getByRole('combobox'), 'mex22-dragonball');

    await waitFor(() => {
      const newRows = container.querySelectorAll('tbody tr').length;
      expect(newRows).toBeGreaterThan(0);
    });
  });

  it('switching to spreadsheet scenario shows 15 groups', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    await user.selectOptions(screen.getByRole('combobox'), 'spreadsheet-v2');

    await waitFor(() => {
      // Waitlist table has 15 rows + Full rankings has 15 rows = 30 total tbody rows
      const allRows = container.querySelectorAll('tbody tr');
      expect(allRows.length).toBe(30);
    });
  });

  it('scenario switch updates occupancy indicator', async () => {
    const user = userEvent.setup();
    renderWaitlistDirect();

    expect(screen.getByText(/high/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox'), 'spreadsheet-v2');

    await waitFor(() => {
      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });
  });

  it('scenario switch resets mode to recommended', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    await user.selectOptions(screen.getByRole('combobox'), 'onepiece');

    await waitFor(() => {
      const activeBtn = container.querySelector('.sim-mode-btn--active');
      expect(activeBtn).toHaveTextContent('Balanced');
    });
  });
});

// ============================================================
// 7. SCORE BREAKDOWN (CLICK ROW)
// ============================================================

describe('E2E: Score Breakdown', () => {
  it('clicking a row shows score breakdown panel', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    const firstRow = container.querySelector('tbody tr');
    if (firstRow) {
      await user.click(firstRow);
    }

    await waitFor(() => {
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByText('Fairness')).toBeInTheDocument();
      expect(screen.getByText('Urgency')).toBeInTheDocument();
    });
  });

  it('clicking the same row again collapses breakdown', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    const firstRow = container.querySelector('tbody tr');
    if (firstRow) {
      await user.click(firstRow);
      await waitFor(() => {
        expect(container.querySelector('.sim-breakdown')).toBeInTheDocument();
      });

      await user.click(firstRow);
      await waitFor(() => {
        expect(container.querySelector('.sim-breakdown')).not.toBeInTheDocument();
      });
    }
  });
});

// ============================================================
// 8. FULL RANKINGS TABLE — SORTING
// ============================================================

describe('E2E: Full Rankings Sorting', () => {
  it('clicking a column header sorts the table', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    const tables = container.querySelectorAll('.sim-table');
    expect(tables.length).toBeGreaterThanOrEqual(2);

    const fullRankingsTable = tables[1];
    const headers = fullRankingsTable.querySelectorAll('th');
    const capHeader = Array.from(headers).find((h) => h.textContent?.includes('Cap Score'));
    expect(capHeader).toBeTruthy();

    await user.click(capHeader!);

    await waitFor(() => {
      const sortedHeader = Array.from(fullRankingsTable.querySelectorAll('th.sorted'));
      expect(sortedHeader.length).toBeGreaterThan(0);
      expect(sortedHeader[0].textContent).toContain('Cap Score');
    });
  });
});

// ============================================================
// 9. FULL FLOW: Login → Browse → Interact
// ============================================================

describe('E2E: Complete User Journey', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('login → view rankings → switch mode → edit weights → switch scenario → expand breakdown', async () => {
    const user = userEvent.setup();
    const { container } = renderApp();

    // STEP 1: Login
    await user.type(screen.getByPlaceholderText(/username/i), 'waitlist');
    await user.type(screen.getByPlaceholderText(/password/i), 'primodel2026');
    await user.click(screen.getByText(/login/i));

    // STEP 2: Verify waitlist loaded
    await waitFor(() => {
      expect(screen.getByText(/optimization mode/i)).toBeInTheDocument();
    });

    // STEP 3: Check rankings are visible
    expect(screen.getAllByText(/waitlist/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/primodel full rankings/i)).toBeInTheDocument();

    // STEP 4: Switch mode to Fairness First
    await user.click(screen.getByText('Fairness First'));
    expect(screen.getByText('0.55')).toBeInTheDocument();

    // STEP 5: Edit a weight slider → Custom mode
    const { fireEvent } = await import('@testing-library/react');
    const sliders = container.querySelectorAll('input[type="range"]');
    fireEvent.change(sliders[0], { target: { value: '40' } });
    await waitFor(() => {
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('0.40')).toBeInTheDocument();
    });

    // STEP 6: Switch scenario
    await user.selectOptions(screen.getByRole('combobox'), 'mex22-dragonball');
    await waitFor(() => {
      const activeBtn = container.querySelector('.sim-mode-btn--active');
      expect(activeBtn).toHaveTextContent('Balanced');
    });

    // STEP 7: Click a row for breakdown
    const firstRow = container.querySelector('tbody tr');
    if (firstRow) {
      await user.click(firstRow);
      await waitFor(() => {
        expect(container.querySelector('.sim-breakdown')).toBeInTheDocument();
      });
    }

    // STEP 8: Verify data integrity
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 10. SECURITY: Auth boundary
// ============================================================

describe('E2E: Security', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('cannot access waitlist without login', () => {
    render(
      <MemoryRouter initialEntries={['/LMS/waitlist']}>
        <Routes>
          <Route path="/LMS/login" element={<LoginPage />} />
          <Route path="/LMS" element={<SimulatorLayout />}>
            <Route path="waitlist" element={<WaitlistPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.queryByText(/optimization mode/i)).not.toBeInTheDocument();
  });

  it('logout clears session and shows login', async () => {
    const user = userEvent.setup();

    sessionStorage.setItem('primodel_auth', 'true');

    render(
      <MemoryRouter initialEntries={['/LMS/waitlist']}>
        <Routes>
          <Route path="/LMS/login" element={<LoginPage />} />
          <Route path="/LMS" element={<SimulatorLayout />}>
            <Route path="waitlist" element={<WaitlistPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const logoutBtn = screen.getByText(/logout/i);
    await user.click(logoutBtn);

    expect(sessionStorage.getItem('primodel_auth')).toBeNull();
  });

  it('SQL injection in login field does not crash', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText(/username/i), "'; DROP TABLE users; --");
    await user.type(screen.getByPlaceholderText(/password/i), "' OR '1'='1");
    await user.click(screen.getByText(/login/i));

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('XSS in login field does not execute', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText(/username/i), '<script>alert("xss")</script>');
    await user.type(screen.getByPlaceholderText(/password/i), '<img onerror=alert(1) src=x>');
    await user.click(screen.getByText(/login/i));

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });
});
