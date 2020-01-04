import React, {useState} from 'react';
import {Button} from 'reactstrap';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from '../../nav/globalNav.js';
import RightSide from '../search/search.js';
import Pranav from '../../svg/Pranav.jpeg';
import Wallpaper from '../../svg/wallpaper.jpeg';

import Tweet from '../../pages/home/userTweet.js';
import BackButton from '../../svg/backProfile.png';
import like from '../../svg/like.jpeg';
import retweet from '../../svg/retweet.jpeg';
import comment from '../../svg/comment.jpeg';
//import option from '../../svg/option.jpeg';
import bookmark from '../../svg/bookmark.jpeg';
import Location from '../../svg/location.png';
import Calendar from '../../svg/calendar.png';
import Birthday from '../../svg/birthday.jpeg';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Redirect} from 'react-router';

import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
let userTweets=null, redirectToViewListFlag=false, redirectToViewList=null;

class NoMedia extends React.Component {
  render(){
    return(
      <div>
        <h5 className="MainAccouncement-Media">You haven't Tweeted any photos or videos yet</h5>
        <h6 className="SubAccouncement-Media">When you send with photos or videos in them, they will show up here.</h6>
        <Button className="buttonNoTweet"> Tweet a photo or video</Button>
      </div>
    )
  }
}

class NoLikes extends React.Component {
  render(){
    return(
      <div>
        <h5 className="MainAccouncement-Likes">You don't have any likes yet</h5>
        <h6 className="SubAccouncement-Likes">Tap the heart on any Tweet to show it some love. When you do, it'll show up here.</h6>
      </div>
    )
  }
}

const Tabs = (props) => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <div>
      {alert('tabs')}
      <Nav tabs className="ProfileTabsDiv">
        <NavItem  className="ProfileTabs">
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Tweets
          </NavLink>
        </NavItem>
        <NavItem  className="ProfileTabs">
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Tweets & replies
          </NavLink>
        </NavItem>
        <NavItem  className="ProfileTabs">
          <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >
            Media
          </NavLink>
        </NavItem>
        <NavItem  className="ProfileTabs">
          <NavLink
            className={classnames({ active: activeTab === '4' }) }
            onClick={() => { toggle('4'); }}
          >
            Likes
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <div className="Profile-Profile-Card">
              {userTweets}
          </div>
        </TabPane>
        <TabPane tabId="2">
          <div className="Profile-Profile-Card">
              <Tweet/>
          </div>
        </TabPane>
        <TabPane tabId="3">
          <NoMedia />
        </TabPane>
        <TabPane tabId="4">
          <NoLikes />
        </TabPane>
      </TabContent>
    </div>
  );
}

class ProfileTopBar extends React.Component {

  render(){
    return(
      <div className = "ProfileBar">
        <div>
          <Button className = "BarTitle"> <h3>{localStorage.getItem('otherUserHandle')}</h3></Button>
        </div>
        <div>
         <Button className = "BackButton"><img top width="69%" src={BackButton}/></Button>
        </div>
      </div>
    )
  }

}
let bio=null, ownTweets=null, bdate=null
class ProfileCard extends React.Component {

constructor(props)
{
 
  super(props)
  this.state={
    profiledata:{}
  }

}

follow = (tobefollowdid)=>{

  let data={initiateId:localStorage.getItem("id"),tobeFollowedID:tobefollowdid}
  axios.defaults.withCredentials = true;//very imp, sets credentials so that backend can load cookies
  axios.post('/users/addFollowers', data)
    .then((response) => {
      console.log('Success follow operation, going to reload !!!',response.data)
      window.location.reload();
    })
    .catch(()=>{console.log('error')})


}

unfollow = (tobeunfollowdid)=>{
  let data={id:localStorage.getItem("id"),unfollowId:tobeunfollowdid}
  axios.defaults.withCredentials = true;//very imp, sets credentials so that backend can load cookies
  axios.post('/users/unfollow', data)
    .then((response) => {
      console.log('Success unfollow operation, going to reload !!!',response.data)
      window.location.reload();
    })
    .catch(()=>{console.log('error')})

}

componentWillMount=()=>{
  console.log('Search Tweet loaded!!!!',localStorage.getItem('searchTweet'))
  let data = {hashTag:localStorage.getItem('searchTweet')};
  let token=localStorage.getItem('bearer-token');
  // alert('asd')
  axios.defaults.withCredentials = true;//very imp, sets credentials so that backend can load cookies
  axios.post('/users/searchByHashTags', data)
    .then((response) => {
      console.log('response is searchTweet !!!',response.data)
      let res=response.data
      let ownTweets = [];
      res.forEach(elem => {
          console.log('Tweet object outer is',elem)
          elem.tweets.forEach(el=>{
            console.log('Tweet object is',el)
            ownTweets.push(el);
          })
      });
      console.log('Tweet Searched are!!!!!',ownTweets)
        console.log('response ok',response.data)
        userTweets=ownTweets.map((twt, index) =>{
          return(
            <div className="tweetCard-indi">
            <div className="Tweet-Image">
              <br/>
              <img className="image" src={twt.image}/>
            </div>
            <div className="Tweet-Body">
              <br/>
              <div className="Tweet-Body-Content">
                <h5 className="Tweet-Body-Name">{twt.name}</h5>
                <p className="Tweet-Body-Handle">{twt.userHandle}</p>
                <p className="Tweet-Body-Date">{twt.date}</p>
              </div>
              <div>
                <p className="Tweet-Body-Text">{twt.tweet}</p>
              </div>
              <div className="Tweet-Body-Panel">
                <button className="Tweet-Body-Panel-Comment" ><img src={comment}/></button>
                <button className="Tweet-Body-Panel-ReTweet" ><img src={retweet}/></button>
                <button className="Tweet-Body-Panel-Like" ><img src={like}/></button>
                <button className="Tweet-Body-Panel-Bookmark" ><img src={bookmark}/></button>
                <br/>
                <br/>
                <br/>
              </div>
            </div>
          </div>
          )
        }               
            )
            this.setState({})
    })
    .catch(()=>{console.log('error')})
}
showList=()=>{
  redirectToViewListFlag=true;
  this.setState({})
}
  render(){
   // console.log('This profiledata state is!!!!!!!!!!!!!!!!!!!!!!!!!!!',this.state.profiledata)
    
    if(redirectToViewListFlag)
    {
      redirectToViewList=<Redirect to="/showUserListPage"/>
      redirectToViewListFlag=false;
    }
    return(
      <div className="ProfileCard-Parent">
        {redirectToViewList}
          <div className="ProfileCard-Wallpaper">
            <img src={Wallpaper}/>
          </div>
          <div className="ProfileCard-Image">
            <img className = "image" src={Pranav} />
          </div>
          <div>
            <Button className="EditButton EditButton2">Edit Profile</Button>
          </div>
       
          <div>
            {/* <Tabs/> */}
            {userTweets}
          </div>
      </div>
    )
  }

}
const CreateChatModal = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
const sendMessage=()=>{
  let data={
    "senderId" : localStorage.getItem('id'),
    "receiverId" : localStorage.getItem('otherUserId'),
    "message": document.getElementById('sendChatMessage').value,
    "senderHandle" :localStorage.getItem('userHandle'),
    "receiverHandle" :localStorage.getItem('otherUserHandle')
  }
  axios.defaults.withCredentials=true
  axios.post('/messages/createChat',data)
  .then((response)=>{
    console.log('create cht resp',response.data)
    if(localStorage.getItem('chats')==null)
      localStorage.setItem('chats',response.data._id)
    else
      localStorage.setItem('chats',localStorage.getItem('chats')+","+response.data._id)
    window.location.reload()
  })
  .catch((err)=>{
    console.log('err create chat',err)
  })
}
  return (
    <span>
      <Button color="primary" onClick={toggle}>Message</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        {/* <ModalHeader toggle={toggle}>Message</ModalHeader> */}
        <ModalBody>
        <Form>
      <FormGroup row>
        <Label for="exampleEmail" sm={2}>Message</Label>
        <Col sm={10}>
          <Input type="email" name="email" id="sendChatMessage" placeholder="send a message"  />
        </Col>
      </FormGroup>
      </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={sendMessage}>Send</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </span>
  );
}
class ProfileTabs extends React.Component {

  render(){
    return(
      <div>
        <p> yo </p>
      </div>
    )
  }

}

class tweetSearchPage extends React.Component {

  render(){
    return(

      <div className="Profile">
        <div className="Profile-Navigation">
          <Navigation />
        </div>

          <ProfileTopBar/>

        <div>
          <ProfileCard/>
        </div>
        <div className="Profile-RightSide">
          <RightSide />
        </div>
      </div>
    )
  }

}

export default tweetSearchPage;
