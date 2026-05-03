import { describe, expect, it, vi } from "vitest";

import { decryptSensitive, encryptSensitive } from "./encryption";

describe("encryption utility", () => {
  it("returns ciphertext, iv, and salt as base64 strings", async () => {
    const encrypted = await encryptSensitive("uid-123", "EPIC-ABCD-1234");

    expect(encrypted.ciphertext).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(encrypted.iv).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(encrypted.salt).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it("decrypts valid ciphertext to original string", async () => {
    const payload = "AC-42|EPIC-XYZ";
    const encrypted = await encryptSensitive("uid-abc", payload);

    const decrypted = await decryptSensitive("uid-abc", encrypted);
    expect(decrypted).toBe(payload);
  });

  it("fails to decrypt with wrong uid", async () => {
    const encrypted = await encryptSensitive("uid-A", "sensitive-value");

    await expect(decryptSensitive("uid-B", encrypted)).rejects.toThrow();
  });

  it("is deterministic for same input with mocked random bytes", async () => {
    const originalGetRandomValues = crypto.getRandomValues.bind(crypto);
    const randomSpy = vi
      .spyOn(crypto, "getRandomValues")
      .mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
        if (!array) return array;

        const view = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        view.fill(7);

        return array;
      });

    const first = await encryptSensitive("uid-deterministic", "constant");
    const second = await encryptSensitive("uid-deterministic", "constant");

    expect(first).toEqual(second);

    randomSpy.mockRestore();
    crypto.getRandomValues = originalGetRandomValues;
  });
});
