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
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { WaitlistPage } from '../pages/WaitlistPage';
import { SimulatorLayout } from '../components/SimulatorLayout';

// ============================================================
// HELPERS
// ============================================================

function renderApp(initialRoute = '/LMS/login') {
  // Clear sessionStorage to ensure clean state
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
  // Pre-authenticate
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
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByAltText(/collinson/i)).toBeInTheDocument();
    expect(screen.getByText(/primodel simulator/i)).toBeInTheDocument();
  });

  it('shows error for wrong credentials', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/username/i), 'wrong');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByText(/sign in/i));

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('disables sign in button when fields are empty', () => {
    renderApp();
    const btn = screen.getByText(/sign in/i);
    expect(btn).toBeDisabled();
  });

  it('navigates to waitlist after successful login', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/username/i), 'waitlist');
    await user.type(screen.getByLabelText(/password/i), 'primodel2026');
    await user.click(screen.getByText(/sign in/i));

    // Should now show the waitlist page with control panel
    await waitFor(() => {
      expect(screen.getByText(/optimization mode/i)).toBeInTheDocument();
    });
  });

  it('password field toggles visibility', async () => {
    const user = userEvent.setup();
    renderApp();

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the show/hide button
    const toggleBtn = screen.getByText('👁');
    await user.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
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

    // Should show login, not waitlist
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
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
    // Andy's Lounge has 13 passengers — should render in both tables
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

    // Initially on efficiency_focus (recommended for toystory scenario)
    // Click Balanced
    await user.click(screen.getByText('Balanced'));

    // The Balanced button should now be active
    const activeBtn = container.querySelector('.sim-mode-btn--active');
    expect(activeBtn).toHaveTextContent('Balanced');
  });

  it('switching mode updates weight slider values', async () => {
    const user = userEvent.setup();
    renderWaitlistDirect();

    // Click Fairness First — should set W2 to 0.55
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

    // Find the first range input (W1 Capacity)
    const sliders = container.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBe(3);

    // Change the first slider value via fireEvent (user-event doesn't handle range well)
    fireEvent.change(sliders[0], { target: { value: '60' } }); // 0.60

    // Custom mode should now be active
    await waitFor(() => {
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  it('weight values update when slider changes', async () => {
    const { container } = renderWaitlistDirect();
    const { fireEvent } = await import('@testing-library/react');

    const sliders = container.querySelectorAll('input[type="range"]');
    const slider = sliders[0] as HTMLInputElement;

    fireEvent.change(slider, { target: { value: '45' } }); // 0.45

    await waitFor(() => {
      expect(screen.getByText('0.45')).toBeInTheDocument();
    });
  });

  it('selecting a preset mode after custom resets weights', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();
    const { fireEvent } = await import('@testing-library/react');

    // Go to custom
    const sliders = container.querySelectorAll('input[type="range"]');
    fireEvent.change(sliders[0], { target: { value: '60' } });

    // Now click Balanced
    await user.click(screen.getByText('Balanced'));

    // Weights should be back to balanced (0.35, 0.30, 0.35)
    const values = screen.getAllByText('0.35');
    expect(values.length).toBeGreaterThanOrEqual(2); // W1 and W3
  });
});

// ============================================================
// 6. SCENARIO SWITCHING
// ============================================================

describe('E2E: Scenario Switching', () => {
  it('switching scenario changes the table data', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    // Count initial rows
    const initialRows = container.querySelectorAll('tbody tr').length;

    // Switch to Dragon Ball scenario (8 passengers)
    await user.selectOptions(screen.getByRole('combobox'), 'mex22-dragonball');

    await waitFor(() => {
      const newRows = container.querySelectorAll('tbody tr').length;
      // Dragon Ball has 8 entries → 8 rows in each table = different from initial
      expect(newRows).not.toBe(initialRows);
    });
  });

  it('switching to spreadsheet scenario shows 6 groups', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    await user.selectOptions(screen.getByRole('combobox'), 'spreadsheet-v2');

    await waitFor(() => {
      // Waitlist table has 6 rows + Full rankings has 6 rows = 12 total tbody rows
      const allRows = container.querySelectorAll('tbody tr');
      expect(allRows.length).toBe(12); // 6 + 6
    });
  });

  it('scenario switch updates occupancy indicator', async () => {
    const user = userEvent.setup();
    renderWaitlistDirect();

    // Default is high occupancy
    expect(screen.getByText(/high/i)).toBeInTheDocument();

    // Switch to spreadsheet (medium occupancy: 30/50)
    await user.selectOptions(screen.getByRole('combobox'), 'spreadsheet-v2');

    await waitFor(() => {
      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });
  });

  it('scenario switch resets mode to recommended', async () => {
    const user = userEvent.setup();
    const { container } = renderWaitlistDirect();

    // Switch to GRU peak (recommended: efficiency_focus)
    await user.selectOptions(screen.getByRole('combobox'), 'tc5-gru-peak');

    await waitFor(() => {
      const activeBtn = container.querySelector('.sim-mode-btn--active');
      expect(activeBtn).toHaveTextContent('Efficiency Focus');
    });
  });
});

// ============================================================
// 7. SCORE BREAKDOWN (CLICK ROW)
// ============================================================

describe('E2E: Score Breakdown', () => {
  it('clicking a row shows score breakdown panel', async () => {
    const user = userEvent.setup();
    renderWaitlistDirect();

    // Click the first passenger row in the waitlist table
    const firstPassenger = screen.getAllByText(/★/)[0].closest('tr');
    if (firstPassenger) {
      await user.click(firstPassenger);
    }

    await waitFor(() => {
      // Breakdown should show dimension labels
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
      // Open
      await user.click(firstRow);
      await waitFor(() => {
        expect(container.querySelector('.sim-breakdown')).toBeInTheDocument();
      });

      // Close
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

    // Full Rankings table is the second .sim-table
    const tables = container.querySelectorAll('.sim-table');
    expect(tables.length).toBeGreaterThanOrEqual(2);

    const fullRankingsTable = tables[1];
    const headers = fullRankingsTable.querySelectorAll('th');
    // Find Cap Score header
    const capHeader = Array.from(headers).find((h) => h.textContent?.includes('Cap Score'));
    expect(capHeader).toBeTruthy();

    await user.click(capHeader!);

    // After re-render, query fresh DOM
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
    await user.type(screen.getByLabelText(/username/i), 'waitlist');
    await user.type(screen.getByLabelText(/password/i), 'primodel2026');
    await user.click(screen.getByText(/sign in/i));

    // STEP 2: Verify waitlist loaded
    await waitFor(() => {
      expect(screen.getByText(/optimization mode/i)).toBeInTheDocument();
    });

    // STEP 3: Check rankings are visible
    expect(screen.getAllByText(/waitlist/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/primodel full rankings/i)).toBeInTheDocument();

    // STEP 4: Switch mode to Fairness First
    await user.click(screen.getByText('Fairness First'));
    expect(screen.getByText('0.55')).toBeInTheDocument(); // W2 fairness weight

    // STEP 5: Edit a weight slider → Custom mode
    const { fireEvent } = await import('@testing-library/react');
    const sliders = container.querySelectorAll('input[type="range"]');
    fireEvent.change(sliders[0], { target: { value: '40' } }); // W1 = 0.40
    await waitFor(() => {
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('0.40')).toBeInTheDocument();
    });

    // STEP 6: Switch scenario
    await user.selectOptions(screen.getByRole('combobox'), 'mex22-dragonball');
    await waitFor(() => {
      // Should reset to recommended mode for this scenario
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

    // STEP 8: Verify data integrity — all operations completed without crashes
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

    // Should redirect to login
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.queryByText(/optimization mode/i)).not.toBeInTheDocument();
  });

  it('logout clears session and shows login', async () => {
    const user = userEvent.setup();

    // Pre-authenticate
    sessionStorage.setItem('primodel_auth', 'true');

    const { unmount } = render(
      <MemoryRouter initialEntries={['/LMS/waitlist']}>
        <Routes>
          <Route path="/LMS/login" element={<LoginPage />} />
          <Route path="/LMS" element={<SimulatorLayout />}>
            <Route path="waitlist" element={<WaitlistPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Click logout
    const logoutBtn = screen.getByText(/logout/i);
    await user.click(logoutBtn);

    // Session should be cleared
    expect(sessionStorage.getItem('primodel_auth')).toBeNull();
  });

  it('SQL injection in login field does not crash', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/username/i), "'; DROP TABLE users; --");
    await user.type(screen.getByLabelText(/password/i), "' OR '1'='1");
    await user.click(screen.getByText(/sign in/i));

    // Should just show error, not crash
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('XSS in login field does not execute', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/username/i), '<script>alert("xss")</script>');
    await user.type(screen.getByLabelText(/password/i), '<img onerror=alert(1) src=x>');
    await user.click(screen.getByText(/sign in/i));

    // Should show error, no script execution
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });
});
