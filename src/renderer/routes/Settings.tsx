import {Button, Col, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row} from "react-bootstrap";
import {useState} from "react";
import {Languages} from "../interfaces/languages";
import useLauncherSettings from "../hooks/useLauncherSettings";
//import useGmpSettings from "../hooks/useGmpSettings";

export default function Settings() {
    const [launcherSettings, setLauncherSettings] = useLauncherSettings();
    //const gmpSettings = useGmpSettings();

    const [devMode, setDevMode] = useState(false);
    const [zSpyLevel, setZSpyLevel] = useState(9);
    const [enableGothicExceptions, setEnableGothicExceptions] = useState(false);
    const [chatlines, setChatlines] = useState(10);
    const [language, setLanguage] = useState(Languages.EN); // TODO: get default user language
    const [chatlog, setChatlog] = useState(false);
    const [toggleWalk, setToggleWalk] = useState(true);
    const [disableCapslockInChat, setDisableCapslockInChat] = useState(false);

    const changePath = async () => {
        const result: string = await window.electronAPI.selectGothicPath(launcherSettings?.gothicPath ?? '');
        if (result) {
            const res = {...launcherSettings as LauncherSettings, gothicPath: result};
            setLauncherSettings(res);
        }
    };

    const openChatlogsFolder = async () => {
        await window.electronAPI.openChatlogsFolder();
    }

    return (<>
        <div className="py-5">
            <h3>Launcher Settings</h3>
            <Row className="row-cols-2 gy-3">
                <Col as={FormGroup} controlId="gothic-path" xs={12}>
                    <FormLabel>Gothic path</FormLabel>
                    <InputGroup>
                        <Button type="button" variant="primary" onClick={changePath}>
                            Change Path
                        </Button>
                        <FormControl type="text" placeholder="No path selected" disabled value={launcherSettings?.gothicPath ?? ""}/>
                    </InputGroup>
                </Col>
                <Col xs={12}>
                    <FormCheck
                        type="switch"
                        id="develop-switch"
                        label="Enable debugging (for developer)"
                        checked={devMode}
                        onChange={v => setDevMode(v.target.checked)}
                    />
                </Col>
                {devMode && <>
                    <Col as={FormGroup} controlId="zspy">
                        <FormLabel>zSpy log level</FormLabel>
                        <FormControl type="number" min={0} max={9} value={zSpyLevel}
                                     onChange={(v) => setZSpyLevel(+v.target.value)}/>
                    </Col>
                    <Col xs={12}>
                        <FormCheck
                            type="switch"
                            id="enable-gothic-exceptions"
                            label="Enable Gothic exception handling"
                            checked={enableGothicExceptions}
                            onChange={v => setEnableGothicExceptions(v.target.checked)}
                        />
                    </Col>
                </>}
            </Row>

            <h3 className="mt-5">GMP Settings</h3>
            <Row className="row-cols-2 gy-3">
                <Col as={FormGroup} controlId="gmp-language">
                    <FormLabel>Language</FormLabel>
                    <FormSelect aria-label="English" value={language} onChange={v => setLanguage(+v.target.value)}>
                        <option value={Languages.EN}>English</option>
                        <option value={Languages.DE}>German</option>
                        <option value={Languages.PL}>Polish</option>
                        <option value={Languages.RU}>Russian</option>
                    </FormSelect>
                </Col>
                <Col as={FormGroup} controlId="gmp-chatlines">
                    <FormLabel>Chatlines</FormLabel>
                    <FormControl type="number" min={5} max={30} value={chatlines}
                                 onChange={(v) => setChatlines(+v.target.value)}/>
                </Col>
                <Col xs={3} as={FormGroup} controlId="gmp-chatlog">
                    <FormCheck
                        type="switch"
                        label="Enable Chatlogs"
                        checked={chatlog}
                        onChange={v => setChatlog(v.target.checked)}
                    />
                </Col>
                <Col xs={3} as={FormGroup} controlId="gmp-toggle-walkmode">
                    <FormCheck
                        type="switch"
                        label="Toggle walkmode (shift)"
                        checked={toggleWalk}
                        onChange={v => setToggleWalk(v.target.checked)}
                    />
                </Col>
                <Col xs={3} as={FormGroup} controlId="gmp-disable-capslock">
                    <FormCheck
                        type="switch"
                        label="Disable Capslock in chat"
                        checked={disableCapslockInChat}
                        onChange={v => setDisableCapslockInChat(v.target.checked)}
                    />
                </Col>
                <Col xs={12}>
                    <Button variant="link" onClick={() => openChatlogsFolder()}>
                        Open chatlogs
                    </Button>
                </Col>
            </Row>
        </div>
    </>);
}