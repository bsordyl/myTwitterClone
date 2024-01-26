import { tweetsData as initialTweetsData} from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

let tweetsData = []

const storedTweets = JSON.parse(localStorage.getItem('tweets'))
if(storedTweets){
    tweetsData = storedTweets
}else{
    tweetsData = initialTweetsData
}

document.addEventListener('click', function(e){
    if(e.target.id === 'h1'){
        refreshPage()
    }
    else if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.tweetreply){
        replyBtnClick(e.target.dataset.tweetreply)
    }
    else if(e.target.dataset.delete){
        handleTrashClick(e.target.dataset.delete)
    }
})

function refreshPage(){
    window.location.reload()
}

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
   
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    setLocalStorage()
    render()
}


function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    setLocalStorage()
    render()
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@WaltDisney`,
            profilePic: `images/waltdisney.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isNew: true,
            uuid: uuidv4()
        })
        setLocalStorage()
        render()
        tweetInput.value = ''
    }
}

 function replyBtnClick(tweetId){
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
     const relatedTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
     })[0]    
     
       if(replyInput.value){
            relatedTweet.replies.unshift({
            handle: `@WaltDisney`,
            profilePic: `images/waltdisney.png`,
            tweetText: replyInput.value,
            uuid:uuidv4()
            })
    }
        setLocalStorage()
        render()
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
}

function handleTrashClick(tweetId){
    const targetTweetObj = tweetsData.findIndex(function(tweet){
        return tweet.uuid === tweetId
    })

    tweetsData.splice(targetTweetObj, 1)
    setLocalStorage()
    render()
}

function setLocalStorage(){
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
}

function getFeedHtml(){
    let feedHtml = ``

    tweetsData.forEach(function(tweet){

        const likeIconClass = tweet.isLiked && 'liked' 
        const retweetIconClass = tweet.isRetweeted && 'retweeted'
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }

        let deleteButton = ''

          if(tweet.isNew){
            deleteButton = 
            `<span class="tweet-detail">
                <i class="fa-solid fa-trash"
                data-delete="${tweet.uuid}"
                ></i>
            </span>`
          }


        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details" id="tweet-details-${tweet.uuid}">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                        ${deleteButton}
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                <img 
                    src="images/waltdisney.png" 
                    class="profile-pic">
                <textarea placeholder="Post your reply" id="reply-input-${tweet.uuid}" class="reply-input" ></textarea>
                <button id="reply-btn" class="reply-btn" data-tweetreply="${tweet.uuid}">Reply</button>
                ${repliesHtml}
            </div>   
        </div>
        `   
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


