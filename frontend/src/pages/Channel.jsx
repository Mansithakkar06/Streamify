import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { api } from '../api/api';

function Channel() {
    const {username}=useParams()
    const [channel,setChannel]=useState("")
    useEffect(() => {
        const fetchChannel=async()=>{
            const res=await api.get(`/users/channel/${username}`)
            setChannel(res.data.data)
        }
        fetchChannel()
    }, []);
    console.log(channel)
  return (
    <div>
      dded
    </div>
  )
}

export default Channel
