export function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
    if (!ref) return;

    if (typeof ref === "function") {
        ref(value);
    } else {
        ref.current = value;
    }
}