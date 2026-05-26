import React from 'react'
import '../Home.css';

const Home = () => {
    const Condition = 1

    return (
        <>
          {/* Condition 1: Log-in not done for the day */}
          {Condition === 1 ? <div>
            You have not logged in for the day
            <form>
              <select type='' name='status'>
                <option>In-Office</option>
                <option>Work From Home</option>
                <option>Leave</option>
              </select>

              <button type='submit
              '>Mark Login</button>
            </form>
            </div> : Condition === 2 ? <div>
              {/* Condition 2: Log-in completed but Log-out not done for the day */}
              Login Time: XX:XX:XX
              Status: 
              <button>Mark Logout</button>
            </div> : <div>
              {/* Condition 3: Log-in and Log-out completed for the day */}
              Login Time: XX:XX:XX
              Logout Time: XX:XX:XX
              Status: 
            </div>            
          }
        </>
    )
}

export default Home;