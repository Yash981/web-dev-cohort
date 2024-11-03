const Button = ({
    children,
    className,
    ...props
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
    console.log(children, className, props)
    return ( 
        <>
            <button className={`${className}`} {...props}>{children}</button>
        </>
     );
}
  
export default Button;