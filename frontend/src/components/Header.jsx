import headerImg from '../misc/perfumebottlepng.png';

export default function Header () {
    return(
        <div className='headerArea'>
            <header>
                <img src={headerImg} alt="bottle"/>
                <h1>My Perfume App</h1>
            </header>
        </div>
    )
}