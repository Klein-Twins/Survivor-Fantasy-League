import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const legal = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className='dark:bg-surface-a2-dark mt-auto'>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='space-y-4'>
            <Link to='/' className='flex items-center space-x-2'>
              <img src='/SFLLogoDark.jpeg' alt='Logo' className='h-8 w-8 rounded' />
              <span className='text-lg font-bold dark:text-primary-a2-dark'>Survivor Fantasy League</span>
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h3 className='text-sm font-semibold dark:text-primary-a2-dark mb-4'>Navigation</h3>
            <ul className='space-y-2'>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className='text-sm dark:text-primary-a0-dark hover:text-primary-a3-dark'>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='text-sm font-semibold dark:text-primary-a2-dark mb-4'>Legal</h3>
            <ul className='space-y-2'>
              {legal.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className='text-sm dark:text-primary-a0-dark hover:text-primary-a3-dark'>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className='text-sm font-semibold dark:text-primary-a2-dark mb-4'>Connect</h3>
            <div className='flex space-x-4'>
              <a
                href='https://github.com/Patrick687'
                target='_blank'
                rel='noopener noreferrer'
                className='text-2xl dark:text-primary-a0-dark hover:text-primary-a3-dark'>
                <FaGithub />
              </a>
              <a
                href='https://linkedin.com/in/patrick-hal-klein'
                target='_blank'
                rel='noopener noreferrer'
                className='text-2xl dark:text-primary-a0-dark hover:text-primary-a3-dark'>
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-8 pt-8 border-t dark:border-surface-a3-dark'>
          <p className='text-sm text-center dark:text-primary-a0-dark'>
            © {new Date().getFullYear()} Survivor Fantasy League.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
