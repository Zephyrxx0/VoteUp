import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const upgradeToGoogleMock = vi.fn();

vi.mock("@/lib/auth", () => ({
  upgradeToGoogle: () => upgradeToGoogleMock(),
}));

import { UpgradePrompt } from "./UpgradePrompt";

describe("UpgradePrompt", () => {
  it("invokes linking flow when button is clicked", async () => {
    const user = userEvent.setup();
    upgradeToGoogleMock.mockResolvedValue({ user: { uid: "google-1" }, error: null });

    render(<UpgradePrompt isAnonymous badgesCount={2} />);

    await user.click(screen.getByRole("button", { name: /link google account/i }));

    expect(upgradeToGoogleMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/linked successfully/i)).toBeInTheDocument();
  });
});
