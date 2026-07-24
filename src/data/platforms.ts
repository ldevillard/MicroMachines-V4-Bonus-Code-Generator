export type PlatformId = "pc" | "ps2";

export interface PlatformConfiguration 
{
    name: string;
    modulus: bigint;
    privateExponent: bigint;
    xorMask: bigint;
}

export const platforms: Record<PlatformId, PlatformConfiguration> = 
{
    pc: 
    {
        name: "PC",
        modulus: 0x108ca8d04bbc15c91n,
        privateExponent: 0xe53b7515e7ee2281n,
        xorMask: 0xcc0de3a54e7550f4n,
    },

    ps2: 
    {
        name: "PlayStation 2",
        modulus: 0x13108965ac7cf4191n,
        privateExponent: 0xd0d8a74d71dd59edn,
        xorMask: 0xcc0de3a54e7550f4n,
    },
};