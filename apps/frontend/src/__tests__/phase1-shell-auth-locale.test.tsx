import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

type Locale = "en" | "hi";

const signInAnonMock = vi.fn();

const onboardingState = {
  hasCompletedOnboarding: false,
  selectedLocale: "en" as Locale,
  onboardingStep: 0,
  digilockerVerified: false,
};

const onboardingActions = {
  setHasCompletedOnboarding: (value: boolean) => {
    onboardingState.hasCompletedOnboarding = value;
  },
  setSelectedLocale: (locale: Locale) => {
    onboardingState.selectedLocale = locale;
  },
  setOnboardingStep: (step: number) => {
    onboardingState.onboardingStep = step;
  },
  setDigilockerVerified: (value: boolean) => {
    onboardingState.digilockerVerified = value;
  },
  resetOnboarding: () => {
    onboardingState.hasCompletedOnboarding = false;
    onboardingState.selectedLocale = "en";
    onboardingState.onboardingStep = 0;
    onboardingState.digilockerVerified = false;
  },
};

vi.mock("@/lib/auth", () => ({
  signInAnon: () => signInAnonMock(),
}));

vi.mock("@/lib/onboarding-store", () => ({
  useOnboardingStore: (selector: (state: typeof onboardingState & typeof onboardingActions) => unknown) =>
    selector({ ...onboardingState, ...onboardingActions }),
}));

import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

describe("phase1 shell auth locale", () => {
  beforeEach(() => {
    onboardingActions.resetOnboarding();
    signInAnonMock.mockResolvedValue({ user: { uid: "anon-1" }, error: null });
  });

  it("persists locale selection and advances to identity step", async () => {
    const { rerender } = render(<OnboardingShell />);

    fireEvent.click(screen.getByRole("button", { name: "Hindi हिंदी में जारी रखें" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(onboardingState.selectedLocale).toBe("hi");
    expect(onboardingState.onboardingStep).toBe(1);

    rerender(<OnboardingShell />);
    await waitFor(() => {
      expect(screen.getByText("Start privately")).toBeInTheDocument();
    });
  });

  it("runs anonymous auth before digilocker step", async () => {
    onboardingState.onboardingStep = 1;
    const { rerender } = render(<OnboardingShell />);

    fireEvent.click(screen.getByRole("button", { name: "Continue as Guest" }));

    await waitFor(() => {
      expect(signInAnonMock).toHaveBeenCalledTimes(1);
      expect(onboardingState.onboardingStep).toBe(2);
    });

    rerender(<OnboardingShell />);
    expect(screen.getByText("Verify with DigiLocker")).toBeInTheDocument();
  });

  it("marks onboarding complete when user skips digilocker", () => {
    onboardingState.onboardingStep = 2;
    render(<OnboardingShell />);

    fireEvent.click(screen.getByRole("button", { name: "Skip for Now" }));

    expect(onboardingState.hasCompletedOnboarding).toBe(true);
    expect(onboardingState.onboardingStep).toBe(0);
    expect(onboardingState.digilockerVerified).toBe(false);
  });
});
