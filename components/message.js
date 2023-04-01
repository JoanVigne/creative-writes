export default function Message({children, avatar, username, description,timeStamp}){
    return(
        <div className="message">
            <div className="user">
                <img src={avatar} alt="avatar" />
                <h3>{username}</h3>
            </div>
            <div>
                <div className="time">
            <h5>the {
              new Date(timeStamp.seconds*1000).toLocaleDateString()
              } </h5>
              <h6>at {new Date(timeStamp.seconds*1000).toLocaleTimeString().substring(0, 5)}</h6>
              </div>
                <p>{description}</p>
            </div>
            {children}
        </div>
    )
}