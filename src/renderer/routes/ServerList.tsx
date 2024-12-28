import {Button, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import PlusIcon from "bootstrap-icons/icons/plus-lg.svg?react"
import RemoveIcon from "bootstrap-icons/icons/trash-fill.svg?react"
import StarIcon from "bootstrap-icons/icons/star.svg?react"
import StarFullIcon from "bootstrap-icons/icons/star-fill.svg?react"
import OfflineIcon from "bootstrap-icons/icons/cloud-slash.svg?react"
import {Link} from "react-router";
import {Server} from "../interfaces/server";
import {ChangeEvent, useState} from "react";
import useServers from "../hooks/useServers";
import ServerSearch from "../components/ServerSearch";
import useServerSortOrder from "../hooks/useServerSortOrder";
import usePublicServers from "../hooks/usePublicServers";
import useFavoriteServers from "../hooks/useFavoriteServers";
import AddServerModal from "../components/AddServerModal";
import RemoveServerModal from "../components/RemoveServerModal";

export default function ServerList() {
    const [showAddServerModal, setShowAddServerModal] = useState(false);
    const [addUrl, setAddUrl] = useState<string | null>(null);
    const [isUrlInvalid, setIsUrlInvalid] = useState(true);

    const [showRemoveServerModal, setShowRemoveServerModal] = useState(false);
    const [removeServerName, setRemoveServerName] = useState<string | null>(null);

    const publicServers = usePublicServers();

    const [favoriteServers, setFavoriteServers] = useFavoriteServers();

    const [search, setSearch] = useState("");

    const [sortBy, setSortBy] = useServerSortOrder("NUMERIC_DOWN");

    const {data} = useServers(publicServers.concat(favoriteServers?.filter(b => !publicServers.find(a => a === b)) ?? []));

    const servers: Server[] = (data ?? [])
        .filter(s => search.length === 0 || s.name.toUpperCase().includes(search.toUpperCase()))
        .map(s => ({...s, favorite: favoriteServers?.includes(s.url) ?? false}))
        .sort((a, b) => {
            switch (sortBy) {
                case "ALPHA_DOWN":
                    return b.name.localeCompare(a.name);
                case "ALPHA_UP":
                    return a.name.localeCompare(b.name);
                case "NUMERIC_DOWN":
                    return b.players - a.players;
                case "NUMERIC_UP":
                    return a.players - b.players;
                case "FAVORITES_DOWN":
                    return (a.favorite === b.favorite) ? 0 : a ? 1 : -1;
                case "FAVORITES_UP":
                    return (a.favorite === b.favorite) ? 0 : a ? -1 : 1;
            }
        });

    const handleCloseAddServerModal = () => setShowAddServerModal(false);
    const handleShowAddServerModal = () => setShowAddServerModal(true);

    const handleCloseRemoveServerModal = () => setShowRemoveServerModal(false);
    const handleShowRemoveServerModal = () => setShowRemoveServerModal(true);

    const removeServer = (url: string) => {
        if (favoriteServers !== undefined) {
            setFavoriteServers(favoriteServers.filter(f => f !== url));
        }
    }

    const toggleFavorite = (server: Server) => {
        if (server.favorite) {
            if (publicServers.includes(server.url)) {
                removeServer(server.url);
            } else {
                setRemoveServerName(server.name);
                handleShowRemoveServerModal();
            }
        } else if (favoriteServers !== undefined) {
            setFavoriteServers([...favoriteServers, server.url]);
        }
    }

    const onAddUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddUrl(event.target.value);
        setIsUrlInvalid(!event.target.validity.valid);
    };

    const onRemoveServer = () => {
        removeServer(removeServerName!);
        handleCloseRemoveServerModal();
    }

    const addServer = () => {
        if (!addUrl || isUrlInvalid || favoriteServers === undefined) {
            return;
        }

        setFavoriteServers([...favoriteServers, addUrl]);
        setAddUrl(null);
        setIsUrlInvalid(false);

        handleCloseAddServerModal();
    }

    return (<>
        <div className="pb-5 app-padding-top">
            <Row className="gy-3">
                <Col xs={12}>
                    <Button onClick={handleShowAddServerModal} className="d-flex align-items-center">
                        <PlusIcon aria-hidden className="me-2"/>
                        Add Server
                    </Button>
                </Col>
                <Col xs={12} className="mb-3">
                    <ServerSearch search={search} setSearch={setSearch} sortBy={sortBy} setSortBy={setSortBy}/>
                </Col>
                {servers.map((server) => (
                    <Col xs={12} key={server.url} className="gy-0">
                        <Row className="gx-2">
                            <Col xs={11}>
                                <ListGroup>
                                    <ListGroupItem as={Link} action
                                                   to={`servers/${encodeURIComponent(server.url)}`}
                                                   disabled={!server.online}>
                                        <Row>
                                            <Col className="overflow-x-hidden text-nowrap clip-text">
                                                <Row>
                                                    <Col xs="auto" className="fs-5 texturina">
                                                        {server.name}
                                                    </Col>
                                                    <Col xs="1"
                                                         className="text-muted align-content-center justify-content-center">
                                                        {server.description}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs="auto"
                                                 className="text-end align-content-center justify-content-center">
                                                {server.online
                                                    ? <>{server.players}<span
                                                        className="text-muted">/{server.maxPlayers}</span></>
                                                    :
                                                    <OfflineIcon className="text-danger-emphasis" aria-label="offline"/>
                                                }
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                </ListGroup>
                            </Col>
                            <Col xs="1" className="align-content-center">
                                <Button variant="dark"
                                        onClick={() => toggleFavorite(server)}>
                                    {server.favorite
                                        ? publicServers.includes(server.url)
                                            ? <StarFullIcon aria-label="Remove from favorites"/>
                                            : <RemoveIcon className="text-danger" aria-label="Remove Server"/>
                                        : <StarIcon aria-label="Add to favorites"/>
                                    }
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                ))}
            </Row>

            <AddServerModal show={showAddServerModal} onHide={handleCloseAddServerModal} addUrl={addUrl} invalid={isUrlInvalid} onChange={onAddUrlChange}
                            onClick={addServer}/>
            <RemoveServerModal show={showRemoveServerModal} onHide={handleCloseRemoveServerModal} serverName={removeServerName} onClick={onRemoveServer}/>
        </div>
    </>);
}