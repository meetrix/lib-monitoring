export interface CandidateProps {
  type: 'local' | 'remote';
  candidateType: 'host' | 'srflx' | 'prflx' | 'relay';
  ip: string;
  port: number;
  protocol: 'tcp' | 'udp';
}

export const Candidate = ({type, ip, port, protocol, candidateType}: CandidateProps) => {
  return (<div
    css={{
      display: 'flex',
      justifyContent: 'space-between'
    }}
  >
    <p>{`${type}: `}</p>
    <p>{`${ip}:${port} ${protocol} ${candidateType}`}</p>
  </div>)
};
export default Candidate;
