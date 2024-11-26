"use server";
export const ShareBrainLink = async (share: boolean) => {
  try {
    const response = await fetch(`http://localhost:9000/api/v1/brain/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "",
      },
      body: JSON.stringify({ share: share }),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.log("Error Creating a link", error);
  }
};
