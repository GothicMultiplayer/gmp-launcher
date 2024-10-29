import {Col, Dropdown, DropdownButton, FormControl, Row} from "react-bootstrap";
import SortAlphaUpIcon from "bootstrap-icons/icons/sort-alpha-up.svg?react"
import SortAlphaDownIcon from "bootstrap-icons/icons/sort-alpha-down-alt.svg?react"
import SortNumericUpIcon from "bootstrap-icons/icons/sort-numeric-up.svg?react"
import SortNumericDownIcon from "bootstrap-icons/icons/sort-numeric-down-alt.svg?react"
import SortFavoriteUpIcon from "bootstrap-icons/icons/sort-up.svg?react"
import SortFavoriteDownIcon from "bootstrap-icons/icons/sort-down-alt.svg?react"
//import FilterIcon from "bootstrap-icons/icons/filter.svg?react"

export type ServerSortOrder = "ALPHA_DOWN" | "ALPHA_UP" | "NUMERIC_DOWN" | "NUMERIC_UP" | "FAVORITES_DOWN" | "FAVORITES_UP";

export default function ServerSearch(props: {search: string, setSearch: (s: string) => void, sortBy: ServerSortOrder, setSortBy: (s: ServerSortOrder) => void}) {
    const SortIcon = () => {
        switch (props.sortBy) {
            case "ALPHA_DOWN":
                return <SortAlphaDownIcon aria-hidden/>;
            case "ALPHA_UP":
                return <SortAlphaUpIcon aria-hidden/>;
            case "NUMERIC_DOWN":
                return <SortNumericDownIcon aria-hidden/>;
            case "NUMERIC_UP":
                return <SortNumericUpIcon aria-hidden/>;
            case "FAVORITES_DOWN":
                return <SortFavoriteDownIcon aria-hidden/>;
            case "FAVORITES_UP":
                return <SortFavoriteUpIcon aria-hidden/>;
        }
    }

    const handleAlphaSort = () => {
        if (props.sortBy === "ALPHA_DOWN") {
            props.setSortBy("ALPHA_UP");
        } else {
            props.setSortBy("ALPHA_DOWN");
        }
    };

    const handleNumericSort = () => {
        if (props.sortBy === "NUMERIC_DOWN") {
            props.setSortBy("NUMERIC_UP");
        } else {
            props.setSortBy("NUMERIC_DOWN");
        }
    };

    const handleFavoriteSort = () => {
        if (props.sortBy === "FAVORITES_DOWN") {
            props.setSortBy("FAVORITES_UP");
        } else {
            props.setSortBy("FAVORITES_DOWN");
        }
    };

    return <>
        <Row>
            <Col>
                <FormControl placeholder="Search" value={props.search} onChange={e => props.setSearch(e.target.value)}/>
            </Col>
            {/*<Col xs="auto">*/}
            {/*    <Button className="d-flex align-items-center">*/}
            {/*        <FilterIcon aria-hidden className="me-2"/>*/}
            {/*        Filter*/}
            {/*    </Button>*/}
            {/*</Col>*/}
            <Col>
                <DropdownButton id="dropdown-basic-button" title={<SortIcon/>} variant="dark">
                    <Dropdown.Item onClick={handleAlphaSort} active={props.sortBy === "ALPHA_UP" || props.sortBy === "ALPHA_DOWN"}>
                        Name
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleNumericSort} active={props.sortBy === "NUMERIC_UP" || props.sortBy === "NUMERIC_DOWN"}>
                        Players
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleFavoriteSort} active={props.sortBy === "FAVORITES_UP" || props.sortBy === "FAVORITES_DOWN"}>
                        Favorites
                    </Dropdown.Item>
                </DropdownButton>
            </Col>
        </Row>
    </>
}