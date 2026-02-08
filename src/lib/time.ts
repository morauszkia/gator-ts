const UNIT_RATIOS = {
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
};

export function parseDuration(durationString: string) {
    const durationRegex = /^(\d+)(ms|s|m|h)$/;
    const match = durationString.match(durationRegex);
    if (!match) return;
    if (match.length !== 3) return;

    const amount = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "ms":
            return amount;
        case "s":
            return amount * UNIT_RATIOS.s;
        case "m":
            return amount * UNIT_RATIOS.m;
        case "h":
            return amount * UNIT_RATIOS.h;
        default:
            return;
    }
}

export function formatDuration(duration: number) {
    let residualDuration = duration;
    const parts: Record<string, number> = {};
    for (const [unit, ratio] of Object.entries(UNIT_RATIOS)) {
        if (residualDuration > ratio) {
            parts[unit] = Math.floor(residualDuration / ratio);
            residualDuration %= ratio;
        }
    }
    if (residualDuration > 0) parts["ms"] = residualDuration;

    let formattedDuration = "";
    console.log(Object.entries(parts));
    Object.entries(parts).forEach(([unit, amount], index) => {
        formattedDuration += `${index === 0 ? amount : String(amount).padStart(2, "0")}${unit}`;
    });
    return formattedDuration;
}
