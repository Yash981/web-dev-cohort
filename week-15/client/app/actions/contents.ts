"use server"

export const getAllContents = async () => {
    try {
        const response = await fetch(`http://localhost:9000/api/v1/content`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NzM5YjVjYjE3NzJmN2JkYjNmYjQ3ODIiLCJ1c2VybmFtZSI6ImhlbGxvIiwiaWF0IjoxNzMxODM1MzUwfQ.Ffl5buG1yhZCeyhJ9RUxJCv1M9QWNQ8lhAHW0q_s4To'
                }
            }
        )
        if(!response.ok){
            console.log(response,'error')
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch contents:', error);
        throw new Error('Failed to fetch contents');
    }
}