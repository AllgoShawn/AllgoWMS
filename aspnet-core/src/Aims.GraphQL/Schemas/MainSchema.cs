using Abp.Dependency;
using GraphQL;
using GraphQL.Types;
using Aims.Queries.Container;

namespace Aims.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IDependencyResolver resolver) :
            base(resolver)
        {
            Query = resolver.Resolve<QueryContainer>();
        }
    }
}