import { generateBonusCode } from "../core/bonus-code";
import { platforms, type PlatformId, } from "../data/platforms";

export function initializeApp(): void 
{
    const platformSelect = document.querySelector<HTMLSelectElement>("#platform");

    const profileInput = document.querySelector<HTMLInputElement>("#profile-id");

    const bonusInput = document.querySelector<HTMLInputElement>("#bonus-index");

    const generateButton = document.querySelector<HTMLButtonElement>("#generate");

    const output = document.querySelector<HTMLOutputElement>("#result");

    if (!platformSelect || !profileInput || !bonusInput || !generateButton || !output)
    {
        throw new Error("Required UI element not found.");
    }

    generateButton.addEventListener("click", () => 
    {
        const platformId = platformSelect.value as PlatformId;
        const profileId = Number(profileInput.value);
        const bonusIndex = Number(bonusInput.value);

        output.value = generateBonusCode(platforms[platformId], profileId, bonusIndex);
    });
}