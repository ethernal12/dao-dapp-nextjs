export default function Button({
    children,
    className,
    hovarable = true,
    variant = "purple", //default variant
    ...rest
}) {
    const variants = {
        green: `text-white bg-green-600 ${hovarable && "hover:bg-green-800"}`,
        lightGreen: `text-white bg-green-400 ${hovarable && "hover:bg-green-800"}`,
        purple: `text-white bg-indigo-600 ${hovarable && "hover:bg-indigo-800"}`,
        lightPurple: `text-indigo-600 bg-indigo-100 ${hovarable && "hover:bg-indigo-300"}`,
        orange: `text-white bg-amber-600 ${hovarable && "hover:bg-amber-300"}`,
        red: `text-white bg-red-600 ${hovarable && "hover:bg-red-800"}`,
        lightBlue: `text-white bg-blue-600 ${hovarable && "hover:bg-blue-800"}`,
    }

    return (
        <button
            {...rest}
        

            className={`disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 font-medium rounded-md text-base mr-8${className} ${variants[variant]}`}>
            {/* // children => onClick({connect}) (passed from on click onClick to children) */}
            {children}
        </button>


    )
}