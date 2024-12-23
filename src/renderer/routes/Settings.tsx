import {Button, Col, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row} from "react-bootstrap";
import useLauncherSettings from "../hooks/useLauncherSettings";
import useGmpSettings from "../hooks/useGmpSettings";
import {MouseEvent} from "react";

export default function Settings() {
    const [launcherSettings, setLauncherSettings] = useLauncherSettings();
    const [gmpSettings, setGmpSettings] = useGmpSettings();
    
    if (launcherSettings === undefined || gmpSettings === undefined) {
        return <></>;
    }

    async function changePath() {
        const result: string = await window.electronAPI.selectGothicPath();
        if (result && launcherSettings !== undefined) {
            setLauncherSettings({
                ...launcherSettings,
                gothicPath: result
            });
        }
    }
    
    function changeLauncherSetting<T extends keyof LauncherSettings>(property: T, value: number|boolean) {
        if (launcherSettings !== undefined) {
            setLauncherSettings({
                ...launcherSettings,
                [property]: value
            });
        }
    }

    function changeGmpSetting<T extends keyof GmpSettings>(property: T, value: number|boolean|string) {
        if (gmpSettings !== undefined) {
            setGmpSettings({
                ...gmpSettings,
                [property]: value
            });
        }
    }

    const openChatlogsFolder = async (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        await window.electronAPI.openChatlogsFolder();
    }

    return (<>
        <div className="pb-5 app-padding-top">
            <h3>Settings</h3>
            <Row className="gy-3">
                <Col xs={12} as={FormGroup} controlId="gothic-path">
                    <FormLabel>Gothic path</FormLabel>
                    <InputGroup>
                        <Button type="button" variant="primary" onClick={changePath}>
                            Change Path
                        </Button>
                        <FormControl type="text" placeholder="No path selected" disabled value={launcherSettings.gothicPath}/>
                    </InputGroup>
                </Col>
                <Col xs={6} as={FormGroup} controlId="gmp-language">
                    <FormLabel>Language</FormLabel>
                    <FormSelect aria-label="English" value={gmpSettings.lang} onChange={v => changeGmpSetting("lang", v.target.value)}>
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="pl">Polish</option>
                        <option value="ru">Russian</option>
                    </FormSelect>
                </Col>
                <Col xs={6} as={FormGroup} controlId="gmp-chatlines">
                    <FormLabel>Chatlines</FormLabel>
                    <FormControl type="number" min={5} max={30} value={gmpSettings.chatlines}
                                 onChange={v => changeGmpSetting("chatlines", +v.target.value)}/>
                </Col>
                <Col xs="auto" as={FormGroup} controlId="gmp-chatlog">
                    <FormCheck
                        type="switch"
                        label="Enable Chatlogs"
                        checked={gmpSettings.chatlog}
                        onChange={v => changeGmpSetting("chatlog", v.target.checked)}
                    />
                </Col>
                <Col xs={5} className="ms-3">
                    <a href="#" onClick={(e) => openChatlogsFolder(e)}>
                        open chatlogs
                    </a>
                </Col>
                <Col xs={12} as={FormGroup} controlId="gmp-toggle-walkmode">
                    <FormCheck
                        type="switch"
                        label="Toggle walkmode (shift)"
                        checked={gmpSettings.toggleWalkmode}
                        onChange={v => changeGmpSetting("toggleWalkmode", v.target.checked)}
                    />
                </Col>
                <Col xs={12} as={FormGroup} controlId="gmp-disable-capslock">
                    <FormCheck
                        type="switch"
                        label="Disable Capslock in chat"
                        checked={gmpSettings.disableCapslockInChat}
                        onChange={v => changeGmpSetting("disableCapslockInChat", v.target.checked)}
                    />
                </Col>
                <Col xs={12}>
                    <FormCheck
                        type="switch"
                        id="develop-switch"
                        label="Enable debugging (for developer)"
                        checked={launcherSettings.devMode}
                        onChange={v => changeLauncherSetting("devMode", v.target.checked)}
                    />
                </Col>
                {launcherSettings?.devMode && <>
                    <Col as={FormGroup} controlId="zspy">
                        <FormLabel>zSpy log level</FormLabel>
                        <FormControl type="number" min={0} max={9} value={launcherSettings.zSpyLevel}
                                     onChange={v => changeLauncherSetting("zSpyLevel", +v.target.value)}/>
                    </Col>
                    <Col xs={12}>
                        <FormCheck
                            type="switch"
                            id="enable-gothic-exceptions"
                            label="Enable Gothic exception handling"
                            checked={launcherSettings.enableGothicExceptionHandling}
                            onChange={v => changeLauncherSetting("enableGothicExceptionHandling", v.target.checked)}
                        />
                    </Col>
                </>}
            </Row>
        </div>
    </>);
}