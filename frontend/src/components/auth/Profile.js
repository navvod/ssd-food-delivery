import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-lg text-secondary">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-secondary mb-6 text-center">
          Your Profile
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-secondary">
                Current Email:
              </p>
              <p className="text-base text-gray-700 mt-1">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">
                Role:
              </p>
              <p className="text-base text-gray-700 mt-1">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;