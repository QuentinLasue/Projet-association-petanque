import MatchListResult from "./MatchListResult";

function DrawListResult(draw){
    return (
        <>
            {draw.map((match,index)=>(
                <MatchListResult match={match} key={index}/>
            ))}
        </>
    )
}

export default DrawListResult;