import { useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar';
import ProgressBar from "@ramonak/react-progress-bar";
import SpotifyPlayer from 'react-spotify-player';

import './index.css';
import cfg from './config.json'

const Spotify = (props) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timestamps = props.spotify.timestamps;
        const currentTime = Date.now() - timestamps.start;
        const totalTime = timestamps.end - timestamps.start;
        setProgress(currentTime / totalTime * 100);
    }, [props.spotify])

    return(
        <div 
        className="select-none w-full rounded-2xl p-5 h-24 flex shadow-2xl justify-center items-center flex-row to-gray-900 from-gray-800 bg-gradient-to-t"
        >
            <div className="flex justify-center flex-col">
                <img
                src={props.spotify.album_art_url}
                alt="Album Cover" 
                width={72}
                className="rounded-xl select-none"
                />
            </div>
            <div className="w-full h-full px-2 m-1 flex flex-col justify-between">
                <div className="w-full  h-full flex flex-col">
                    <span className="lg:text text text-xs">Currently Listening</span>
                    <span className="lg:text lg:text-xs text -translate-y-[2px] text-[10px]">{props.spotify.song}</span>
                </div>
                <ProgressBar className="-translate-y-2 lg:translate-y-0" height="6px" bgColor="#27a80d" completed={progress} transitionDuration="0.1s" customLabel=" "/>
            </div>
        </div>
    )
}

const Link = (props) => {
    return(
        <a className="select-none duration-500 ease-out hover:-translate-y-2" href={`https://${props.href}`}>
            <img
            src={props.src}
            alt={props.linkType}
            width={42}
            className="select-none"
            />
        </a>
    )
}

const App = () => {
    const [avatarUri, setAvatarUri] = useState("");
    const [user, setUser] = useState({username: "ege", discriminator: "0000"});
    const [isLoaded, setIsLoaded] = useState(false);
    const [spotify, setSpotify] = useState(
        {
            album: "Listening Nothing",
            album_art_url : "https://productimages.hepsiburada.net/s/3/1500/9587718750258.jpg",
            timestamps: {start: 0, end: 0},
            song: "Listening Nothing"
        }
    )
    const defaultUserUri = "https://external-preview.redd.it/5kh5OreeLd85QsqYO1Xz_4XSLYwZntfjqou-8fyBFoE.png?auto=webp&s=dbdabd04c399ce9c761ff899f5d38656d1de87c2";


    useEffect(() => {
        const retrieveUser = async() => {
            try{
            const result = await fetch(`https://api.lanyard.rest/v1/users/${cfg.discord_id}`);
            const json = await result.json();
            await setUser(json.data.discord_user);

            if(json.data.listening_to_spotify) {
                await setSpotify(json.data.spotify);
            } else {
                await setSpotify(
                    {
                        album: "Listening Nothing",
                        album_art_url : "https://productimages.hepsiburada.net/s/3/1500/9587718750258.jpg",
                        timestamps: {start: 0, end: 0},
                        song: "Listening Nothing"
                    }
                );
            }

            document.title = `Home | ${json.data.discord_user.global_name}`;
            setAvatarUri(`https://cdn.discordapp.com/avatars/${json.data.discord_user.id}/${json.data.discord_user.avatar}.png`)

            setIsLoaded(true);
            } catch(err){
                setIsLoaded(false);
            }
        }
        retrieveUser();

        setInterval(retrieveUser, 1000);
    }, [])

    return(
        <div className="w-full h-full flex justify-center items-center bg-[url('https://usagif.com/wp-content/uploads/gifs/starfall-gif-46.gif')] bg-cover">
            <LoadingBar progress={100} color="#4e1b56"/>
            <div className={`border-gray-700 border ${(isLoaded) ? "animate-starting-animation" : "opacity-0"} w-5/6 h-5/6 lg:h-3/4 rounded-2xl lg:w-1/2 duration-300 justify-center flex flex-col p-10 gap-4 bg-opacity-90 bg-[rgba(17, 25, 40, 0.75)] backdrop-blur-2xl  drop-shadow-lg`}>
                <div className="flex flex-col items-center text-center gap-3">
                    <img
                        alt="pfp.png"
                        src={(user.avatar) ? avatarUri : defaultUserUri}
                        className=" rounded-full"
                        width={96}
                    />
                    <span className="titleText font-semibold">{`${user.username}#${user.discriminator}`}</span>
                </div>

                <div className="flex flex-col items-center text-center">
                    {cfg.display_text.map(e => <span className="text text-opacity-90">{e}</span>)}
                </div>
                {
                (!cfg.spotify.artist) ? <Spotify spotify={spotify}/> : 
                <div className="flex justify-center">
                    <SpotifyPlayer uri={`spotify:artist:${cfg.artist_id}`}   size={{width: '100%', height: 300}} view={'list'} theme={'black'}/>
                </div>
                }   
                <div className="flex flex-row items-end justify-center my-5 gap-2">
                    {
                        cfg.social_links.map(e => <Link src={e.image} href={e.herf} linkType={e.linkType}/>)
                    }
                </div>
            </div>
        </div>
    )
}

export default App;
