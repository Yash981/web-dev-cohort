"use server";

export const SignupRouteAction = async (data: any) => {
  console.log(data, "data server action");
  try {
    const response = await fetch(`http://localhost:9000/api/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errors: errorData,
      };
    }
    const res = await response.json();
    console.log(res, "ress");
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    console.error("Error Signup", error);
    return {
      success: false,
      errors: {
        server: ["An unexpected error occurred"],
      },
    };
  }
};
