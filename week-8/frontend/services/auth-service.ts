interface SignUpProps {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export const signup = async (data: SignUpProps, signupAs: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/${signupAs}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(data)
    })
    const result = await response.json()
    if(!response.ok) {
        throw new Error(result.message || "Signup failed")
    }

    return result

} 
export const signin = async (data: { email: string; password: string}, signinAs: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/${signinAs}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Signin failed");
    }
  
    return result;
};