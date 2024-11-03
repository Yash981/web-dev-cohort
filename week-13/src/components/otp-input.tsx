import { useEffect, useRef, useState } from "react";

const OTPInput = ({
    count,
    className
}: {
    count: number,
    className: any,
}) => {
    const InputRef = useRef([]) as any
    const [inputVal,setInputVal] = useState(Array(count).fill(''))
    useEffect(() => {
            InputRef.current[0].focus();
    }, [])
    
    const FocusChange = (index:number) =>{
        for (let i = index+1; i < count; i++) {
            if(inputVal[i] === ''){
                InputRef.current[i].focus()
                return
            }
        }
    }
    const onChange = (e:any,index:number) =>{
        const value = e.target.value.slice(-1);
        if (/^[0-9]$/.test(value)) {
            setInputVal((prevValues) => {
                const newValues = [...prevValues];
                newValues[index] = value;
                return newValues;
            });
            FocusChange(index)
        } else {
            return
        }
    }
    const onKeyDown = (e:any,index:number) =>{
        if(e.keyCode === 8){
            if(index === 0) return setInputVal((prevValues) => {
                const newValues = [...prevValues];
                newValues[index] = '';
                return newValues;
            })
            InputRef.current[index-1].focus()
            setInputVal((prevValues) => {
                const newValues = [...prevValues];
                newValues[index] = '';
                return newValues;
            })
        }
        if(e.keyCode === 37){
            InputRef.current[index-1].focus()
        }
        if(e.keyCode === 39){
            InputRef.current[index+1].focus()
        }
        
    }
    const onPaste = (e: any) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, count);
        const pasteValues = pasteData.split("").filter((char:any) => /^[0-9]$/.test(char));
        setInputVal((prevValues) => {
            const newValues = [...prevValues];
            pasteValues.forEach((value:any, i:number) => {
                if (i < count) {
                    newValues[i] = value;
                    InputRef.current[i].focus();
                }
            });
            return newValues;
        });
        if(pasteValues.length < count) return InputRef.current[pasteValues.length].focus();
    };
    return (
        <>
            {Array.from({ length: count }).map((_, index:any) => (
                <input type="text" className={className}  ref={el => InputRef.current[index] = el}
                onChange={(e) => onChange(e,index)} key={index} value={inputVal[index]} onKeyDown={(e)=>onKeyDown(e,index)}  onPaste={onPaste}
/>
            ))}

        </>
    );
}

export default OTPInput;