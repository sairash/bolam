import { stringToHexColor } from '@/helper/color'

export default function Color({ name, children }: { name: string, children: React.ReactNode }) {
    return (
        <span style={{ color: stringToHexColor(name) }}>{children}</span>
    )
}