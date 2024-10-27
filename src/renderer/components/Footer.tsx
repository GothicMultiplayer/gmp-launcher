import Container from "react-bootstrap/Container";

export default function Footer() {
    return (
        <footer className="py-5">
            <hr className="mt-5"/>
            <Container className="px-5">
                <div className="mt-4 text-center">
                    <div>
                        GMP is not affiliated with or endorsed by Piranha Bytes, Embracer Group or other rightsholders.
                    </div>
                    <div>Any trademarks used belong to their respective owners.</div>
                </div>
            </Container>
        </footer>
    );
}