import React from 'react';
import '../Home.css';

const Home = () => {
    const Condition = 2;
    const Leave = 0;

    return (
        <>
            {/* Condition 1: Log-in not done for the day */}
            {Condition === 1 ? (
                <div className='condition condition1'>
                    <h2>You have not marked Log-in for the day</h2>
                    <form>
                        <label>Select your work status:</label>
                        <select name='status' defaultValue="Choose your status" required>
                            <option value="Choose your status" disabled hidden>Choose your status</option>
                            <option value="In-Office">In-Office</option>
                            <option value="Work From Home">Work From Home</option>
                            <option value="Leave">Leave</option>
                        </select>
                        <button type='submit'>Mark Login</button>
                    </form>
                </div>
            ) : Condition === 2 ? (
                <div className='condition condition2'>
                    {/* Condition 2: Log-in completed but Log-out not done for the day */}
                    {Leave === 0 ? <h2>You are on leave today</h2> : <h2>You have not marked your Log-out for the day</h2>}
                    <h4>Login Time: XX:XX:XX</h4>
                    <h4>Status: XXX</h4>
                    {Leave === 0 ? null : <button>Mark Logout</button>}
                </div>
            ) : (
                <div className='condition condition3'>
                    {/* Condition 3: Log-in and Log-out completed for the day */}
                    <h2>You have marked both your Log-in and Log-out</h2>
                    <h3>Login Time: XX:XX:XX</h3>
                    <h3>Logout Time: XX:XX:XX</h3>
                    <h3>Status: XXX</h3> 
                </div>            
            )}
        </>
    );
}

export default Home;