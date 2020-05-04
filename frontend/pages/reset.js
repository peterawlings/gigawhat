import Reset from "../components/Reset";
const ResetPage = props => (
  <div>
    <p>Rest your passowrd {props.query.resetToken}</p>
    <Reset resetToken={props.query.resetToken} />
  </div>
);

export default ResetPage;
