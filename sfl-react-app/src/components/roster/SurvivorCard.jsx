import anikaImage from '../../assets/cast-images/anika-dhar.jpeg';

export default function SurvivorCard({survivor}) {
    return (
        <div className="bg-slate-600 rounded-xl mx-auto text-center">
            <h2>{survivor.first_name} {survivor.last_name}</h2>
        </div>
    );
}