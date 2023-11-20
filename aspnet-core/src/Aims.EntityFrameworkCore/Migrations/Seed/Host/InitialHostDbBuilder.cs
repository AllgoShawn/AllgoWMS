using Aims.EntityFrameworkCore;

namespace Aims.Migrations.Seed.Host
{
    public class InitialHostDbBuilder
    {
        private readonly AimsDbContext _context;

        public InitialHostDbBuilder(AimsDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            new DefaultEditionCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();

            _context.SaveChanges();
        }
    }
}
