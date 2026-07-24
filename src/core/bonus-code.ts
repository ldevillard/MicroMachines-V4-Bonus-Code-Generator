import type { PlatformConfiguration } from "../data/platforms";

const BONUS_ALPHABET = "0123456789ABCDEFGHJKLMNPQRTUVWXY";
const BONUS_CODE_LENGTH = 13;

const MAX_PROFILE_ID = 0xffff;
const MAX_BONUS_INDEX = 0x09;

/** Generates a Micro Machines V4 bonus code for a given profile and bonus */
export function generateBonusCode(platform: PlatformConfiguration, profileId: number, bonusIndex: number) : string 
{
    validateArguments(profileId, bonusIndex);

    // The lower 16 bits of the RSA modulus are part of the payload
    const modulusLow16 = platform.modulus & 0xffffn;

    // The game stores the bonus index in the high byte of a 16-bit integer
    const encodedBonusIndex = (BigInt(bonusIndex) << 8n) & 0xffffn;

    // Payload layout: bits 0-15 contain bonusIndex << 8, bits 16-31 the profile ID, and bits 32-47 the RSA modulus's lower 16 bits
    const payload = encodedBonusIndex | (BigInt(profileId) << 16n) | (modulusLow16 << 32n);

    // Apply the XOR transformation before the RSA signature
    const rsaMessage = payload ^ platform.xorMask;

    // Compute the RSA signature as message^d mod N
    const signature = modularExponentiation(rsaMessage, platform.privateExponent, platform.modulus);

    // Convert the result into 13 characters
    return encodeBonusCode(signature);
}

/** Computes base^exponent mod modulus efficiently without constructing the enormous intermediate power */
function modularExponentiation(base: bigint, exponent: bigint, modulus: bigint) : bigint 
{
    if (modulus <= 1n) 
    {
        throw new RangeError("RSA modulus must be greater than one.");
    }

    if (exponent < 0n) 
    {
        throw new RangeError("RSA exponent cannot be negative.");
    }

    let result = 1n;
    let currentBase = base % modulus;
    let currentExponent = exponent;

    while (currentExponent > 0n) 
    {
        if ((currentExponent & 1n) !== 0n) 
        {
            result = (result * currentBase) % modulus;
        }

        currentExponent >>= 1n;
        currentBase = (currentBase * currentBase) % modulus;
    }

    return result;
}

/** Encodes the RSA-signed integer with Codemasters' alphabet, starting with its five least significant bits */
function encodeBonusCode(value: bigint): string 
{
    if (value < 0n) 
    {
        throw new RangeError("Cannot encode a negative bonus-code value.");
    }

    let remainingValue = value;
    let result = "";

    for (let index = 0; index < BONUS_CODE_LENGTH; ++index) 
    {
        const digit = Number(remainingValue & 0x1fn);

        result += BONUS_ALPHABET[digit];
        remainingValue >>= 5n;
    }

    if (remainingValue !== 0n) 
    {
        throw new RangeError(`Value does not fit in a ${BONUS_CODE_LENGTH}-character bonus code.`);
    }

    return result;
}

function validateArguments(profileId: number, bonusIndex: number) : void
{
    if (!Number.isInteger(profileId) || profileId < 0 || profileId > MAX_PROFILE_ID) 
    {
        throw new RangeError(`Profile ID must be an integer between 0 and ${MAX_PROFILE_ID}.`);
    }

    if (!Number.isInteger(bonusIndex) || bonusIndex < 0 || bonusIndex > MAX_BONUS_INDEX) 
    {
        throw new RangeError(`Bonus index must be an integer between 0 and ${MAX_BONUS_INDEX}.`);
    }
}
