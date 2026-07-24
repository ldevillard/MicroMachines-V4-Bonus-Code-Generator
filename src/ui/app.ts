import { generateBonusCode } from "../core/bonus-code";
import { platforms, type PlatformId, } from "../data/platforms";

const BONUS_NAMES = 
[
    "Retro Cam",
    "Car Classes 1 to 5",
    "Car Classes 6 to 10",
    "Car Classes 11 to 15",
    "Car Classes 16 to 20",
    "Car Classes 21 to 25",
    "Beat Learner Division",
    "Beat Rookie Division",
    "Beat Hero Division",
    "Beat Legend Division",
];

export function initializeApp(): void 
{
    const platformSelect = document.querySelector<HTMLSelectElement>("#platform");

    const profileInput = document.querySelector<HTMLInputElement>("#profile-id");

    const generateButton = document.querySelector<HTMLButtonElement>("#generate");

    const results = document.querySelector<HTMLTableSectionElement>("#results");

    const errorOutput = document.querySelector<HTMLParagraphElement>("#error");

    if (!platformSelect || !profileInput || !generateButton || !results || !errorOutput)
    {
        throw new Error("Required UI element not found.");
    }

    generateButton.addEventListener("click", () => 
    {
        const platformId = platformSelect.value as PlatformId;
        const profileId = profileInput.valueAsNumber;

        try
        {
            const rows = BONUS_NAMES.map((bonusName, bonusIndex) =>
            {
                const row = document.createElement("tr");
                const nameCell = document.createElement("th");
                const codeCell = document.createElement("td");
                const code = document.createElement("code");

                nameCell.scope = "row";
                nameCell.textContent = `Bonus ${bonusIndex} - ${bonusName}`;
                code.textContent = generateBonusCode(platforms[platformId], profileId, bonusIndex);
                codeCell.append(code);
                row.append(nameCell, codeCell);

                return row;
            });

            results.replaceChildren(...rows);
            errorOutput.textContent = "";
            errorOutput.hidden = true;
        }
        catch (error)
        {
            results.replaceChildren();
            errorOutput.textContent = error instanceof Error ? error.message : "An unexpected error occurred.";
            errorOutput.hidden = false;
        }
    });
}
