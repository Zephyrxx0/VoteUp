import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MergeConflictDialog } from "./MergeConflictDialog";

describe("MergeConflictDialog", () => {
  it("returns the selected resolution choice", async () => {
    const onChoose = vi.fn();
    const user = userEvent.setup();

    render(
      <MergeConflictDialog
        open
        localConstituency="ac-10"
        cloudConstituency="ac-11"
        onChoose={onChoose}
      />,
    );

    await user.click(screen.getByRole("button", { name: /keep cloud data/i }));
    await user.click(screen.getByRole("button", { name: /overwrite with local progress/i }));

    expect(onChoose).toHaveBeenNthCalledWith(1, "keep-cloud");
    expect(onChoose).toHaveBeenNthCalledWith(2, "overwrite-local");
  });
});
