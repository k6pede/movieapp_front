async function Sample() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/'
    const ans = await fetch(url).then((response) => response.json())

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    await timeout(1000); //for 1 sec delay

    console.log(ans)
    const message = ans.message

    return (
        <div>
            {`${message}です`}
        </div>
    )
}

export default Sample