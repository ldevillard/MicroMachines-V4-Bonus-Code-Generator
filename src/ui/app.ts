import { generateBonusCode } from "../core/bonus-code";
import { platforms, type PlatformId, } from "../data/platforms";

export function initializeApp(): void 
{
    const platformSelect = document.querySelector<HTMLSelectElement>("#platform");

    const profileInput = document.querySelector<HTMLInputElement>("#profile-id");

    const bonusInput = document.querySelector<HTMLInputElement>("#bonus-index");

    const generateButton = document.querySelector<HTMLButtonElement>("#generate");

    const output = document.querySelector<HTMLOutputElement>("#result");

    const errorOutput = document.querySelector<HTMLParagraphElement>("#error");

    if (!platformSelect || !profileInput || !bonusInput || !generateButton || !output || !errorOutput)
    {
        throw new Error("Required UI element not found.");
    }

    generateButton.addEventListener("click", () => 
    {
        const platformId = platformSelect.value as PlatformId;
        const profileId = profileInput.valueAsNumber;
        const bonusIndex = bonusInput.valueAsNumber;

        try
        {
            output.value = generateBonusCode(platforms[platformId], profileId, bonusIndex);
            errorOutput.textContent = "";
            errorOutput.hidden = true;
        }
        catch (error)
        {
            output.value = "—————————————";
            errorOutput.textContent = error instanceof Error ? error.message : "An unexpected error occurred.";
            errorOutput.hidden = false;
        }
    });
}
