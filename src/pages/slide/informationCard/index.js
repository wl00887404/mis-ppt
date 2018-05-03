import React from 'react'
import {connect} from 'react-redux'
import styles from './styles.scss'
import icon from './customer-service.png'
import {showStatus} from '../../../action.js'

class InformationCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            focusLock: false
        }
    }
    _onKeyUp({keyCode}) {
        if (keyCode == 13) {
            this._onSubmit()
        }
    }
    _onChange(e) {
        this.setState({input: e.target.value})
    }
    _onFocus() {
        this.setState({focusLock: true})
    }
    _onBlur() {
        this.setState({focusLock: false})
    }
    _onSubmit() {
        if (this.props.guest == "") {
            this.props.dispatch(showStatus("你尚未登入", "rgba(255,0,0,0.5)"))
            return
        }
        if (this.state.input == "") {
            this.props.dispatch(showStatus("你必須輸入留言", "rgba(255,0,0,0.5)"))
            return
        }
        fetch(`/commits/${this.props.index}`, {
            method: "POST",
            headers: {
                "Content-Type": " application/json"
            },
            body: JSON.stringify({who: this.props.guest, what: this.state.input,}),
        }).then(res => res.json()).then(json => {
            if (json.error) {
                throw json.error
            }
            else {
                this.setState({input:""})
            }
        }).catch(error => {
            console.log(error)
            this.props.dispatch(showStatus("好像哪邊爆炸了", "rgba(255,0,0,0.5)"))
        })

    }
    _placeHolder() {
        if (this.state.input === "" && !this.state.focusLock) {
            return "新增留言"
        } else {
            return this.state.input
        }
    }
    render() {
        let {index, show, toggle, group} = this.props
        let {name, members, teacher, commits,} = group
        members = members.join("、")
        if (commits.length == 0) {
            commits = (
                <div className={styles.noCommits}>目前沒有任何留言</div>
            )
        } else {
            commits = commits.map((commit, i) => (<Commit who={commit.who} when={commit.when} what={commit.what} key={i}/>))
        }
        show = show
            ? {
                transform: "translateX(0)"
            }
            : {}

        return (
            <div className={styles.dataContainer}>
                <div className={styles.icon} onClick={toggle}>
                    <img src={icon}/>
                </div>
                <div className={styles.data} style={show}>

                    <div className={styles.h1}>{name}</div>
                    <div className={styles.detail}>
                        <div>
                            <span className={styles.th}>{"組　　別："}</span>
                            <span className={styles.td}>{index}</span>
                        </div>
                        <div>
                            <span className={styles.th}>{"組　　員："}</span>
                            <span className={styles.td}>{members}</span>
                        </div>
                        <div>
                            <span className={styles.th}>{"指導教授："}</span>
                            <span className={styles.td}>{teacher}</span>
                        </div>
                    </div>

                    <div className={styles.h1}>留言</div>
                    <div className={styles.commits}>
                        {commits}
                    </div>
                    <div className={styles.submitContainer}>
                        <div>
                            <input type="text" spellCheck={false} value={this._placeHolder()} onChange={this._onChange.bind(this)} onKeyUp={this._onKeyUp.bind(this)} onFocus={this._onFocus.bind(this)} onBlur={this._onBlur.bind(this)}/>
                            <button type="button" onClick={this._onSubmit.bind(this)}>留言</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const Commit = ({who, when, what,}) => {
    return (
        <div className={styles.commit}>
            <div>
                <span className={styles.who}>{who}</span>
                <span className={styles.when}>{when}</span>
            </div>
            <div>
                <span className={styles.what}>{what}</span>
            </div>
        </div>
    )
}

export default connect()(InformationCard)
