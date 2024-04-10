/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState,useEffect } from 'react';
import { Input } from 'antd';
import './app.css';
import { Layout} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import Comments from './test-data/comments.json';
import { Card ,Table } from 'antd';
import { Badge } from 'antd';
import { useRef } from 'react';
import { NOWIP } from '../../App';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
const items = [
  {
    key: 1,
    label: 'By video time order',
  },
  {
    key: 2,
    label: 'By send time order',
  },
  {
    key: 3,
    label: 'By student ID order',
  },
];
const Columns = [
  [ 
    {
      title: 'Video Time',
      dataIndex: 'time',
    },
    {
      title: 'Content',
      dataIndex: 'content',
    }
  ],
  [ 
    {
      title: 'Send Time',
      dataIndex: 'real_time',
    },
    {
      title: 'Content',
      dataIndex: 'content',
    }
  ],
  [ 
    {
      title: 'Name',
      dataIndex: 'author',
    },
    {
      title: 'Content',
      dataIndex: 'content',
    }
  ]
];

function transformData(data) {
  function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(remainingSeconds).padStart(2, '0');

      if (hours > 0) {
          return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      } else {
          return `${formattedMinutes}:${formattedSeconds}`;
      }
  }

  return data.map(item => ({
      key: item.id, // Change id to key
      time: formatTime(item.time), // Format time
      content: item.content,
      author: item.author,
      real_time: new Date(item.real_time).toLocaleString(), // Transform real_time using Date object
  }));
}
function MyComments(props) {
    const [columns, setColumns]=useState([]);
    const [chosenComment, setChosenComment] = useState(4);
    const [comments, setComments] = useState([]);
    const [selectedKey,setSelectedKey]= useState(1);
    const isChosenComment = (commentId) => chosenComment === commentId;
    const transformOriginalData = (source) => {

    };
    const handleMenuSelect = ({ key }) => {
      setSelectedKey(key);
    };
   
    useEffect(()=> {
      fetch(`http://${NOWIP}/api/getAllComments?key=${selectedKey}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setComments(data.comments);
        setColumns(Columns[selectedKey-1]);
      });
    },[selectedKey]);

  return (
    <Content className="comment">
      <Dropdown
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: [1],
          onSelect: handleMenuSelect,
        }}
      >
        <Typography.Link style={{fontSize:"18px",padding:"10px 0px 18px 0px"}}>
          <Space>
            {items[selectedKey-1].label}
            <DownOutlined />
          </Space>
        </Typography.Link>
      </Dropdown>
      <Table columns={columns}  pagination={{ pageSize: 13 }} dataSource={transformData(comments)} style={{marginTop:"10px"}} />
                              
            
          
      </Content >
       

      
    );

}

export default MyComments;
